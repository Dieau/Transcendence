import { GqlAuthGuard } from './guards/gql-auth.guard'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service'
import * as DTO from './dto/auth.input'
import { User } from 'src/users/entities/user.entity'
import { CtxSession } from './decorators/ctx-session.decorator'
import { CtxUser } from './decorators/ctx-user.decorator'
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard'
import { PubSub } from 'graphql-subscriptions'
import { UserPresencesService } from 'src/user-presences/user-presences.service'
import { EUserPresenceStatus } from '@prisma/client'

const PUB_UPDATE_USERPRESENCE = `onUpdateUserPresence`

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly userPresencesService: UserPresencesService,
    private readonly pubSub: PubSub,
  ) {}

  //**************************************************//
  //  MUTATION - AUTH LOCAL
  //**************************************************//

  // EMAIL + PASSWORD + 2fasecret
  @Mutation(() => User)
  @UseGuards(GqlLocalAuthGuard)
  signInLocal(@Args(`args`) args: DTO.SignInLocalInput) {
    return this.authService.signInLocal(args)
  }

  @Mutation(() => User)
  signUpLocal(@Args(`args`) args: DTO.SignUpLocalInput) {
    return this.authService.signUpLocal(args)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async isGoogleAuthCodeValid(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.GoogleAuthCodeValidatorInput,
  ) {
    const dbUser = await this.userService.findOne(user.id)
    return this.authService.isTwoFactorAuthenticationCodeValid(
      args.code,
      dbUser,
    )
  }

  //**************************************************//
  //  MUTATION - OAUTH
  //**************************************************//

  // GOOGLE ACCOUNT
  @Mutation(() => Boolean)
  signInGoogle() {
    return true
  }

  // GITHUB ACCOUNT
  @Mutation(() => Boolean)
  signInGithub() {
    return true
  }

  // 42 ACCOUNT
  @Mutation(() => Boolean)
  signIn42() {
    return true
  }

  // DISCORD ACCOUNT
  @Mutation(() => Boolean)
  signInDiscord() {
    return true
  }

  //**************************************************//
  //  MUTATION - COMMON
  //**************************************************//

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logout(@CtxUser() user: User, @CtxSession() session) {
    session.destroy()
    const res = await this.userPresencesService.update(user.id, {
      userId: user.id,
      connected: EUserPresenceStatus.Offline,
    })
    this.pubSub.publish(PUB_UPDATE_USERPRESENCE, res)
    return true
  }
}
