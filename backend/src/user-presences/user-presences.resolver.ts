import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from './../auth/guards/gql-auth.guard'
import { UserPresencesService } from './user-presences.service'
import { UserPresence } from './entities/user-presence.entity'
import { PubSub } from 'graphql-subscriptions'
import * as DTO from './dto/user-presence.input'
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { EUserPresenceStatus } from '@prisma/client'

const PUB_UPDATE_USERPRESENCE = `onUpdateUserPresence`

@Resolver(() => UserPresence)
export class UserPresencesResolver {
  constructor(
    private readonly userPresencesService: UserPresencesService,
    private readonly pubSub: PubSub,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  @Mutation(() => UserPresence)
  @UseGuards(GqlAuthGuard)
  async updateUserPresence(
    @CtxUser() user: User,
    @Args(`args`) args: DTO.UpdateUserPresenceInput,
  ) {
    const actual = await this.userPresencesService.getUserPresence(user.id)
    if (actual.connected !== EUserPresenceStatus.InGame)
    {
      const res = await this.userPresencesService.update(user.id, args)
      this.pubSub.publish(PUB_UPDATE_USERPRESENCE, res)
      return res
    }
    return actual
  }

  //**************************************************//
  //  QUERY
  //**************************************************//

  @Query(() => UserPresence)
  @UseGuards(GqlAuthGuard)
  async findUserPresence(@Args(`args`) args: DTO.FindUserPresencesInput) {
    return await this.userPresencesService.getUserPresence(args.userId)
  }

  //**************************************************//
  //  SUBSCRIPTION
  //**************************************************//

  @Subscription(() => UserPresence, {
    filter(payload: UserPresence, variables: any) {
      return payload.userId === variables.args.userId
    },
    resolve: (value) => value,
  })
  onUpdateUserPresence(@Args(`args`) args: DTO.OnUpdateUserPresenceInput) {
    return this.pubSub.asyncIterator(PUB_UPDATE_USERPRESENCE)
  }
}
