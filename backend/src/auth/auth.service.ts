import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { UserPresencesService } from 'src/user-presences/user-presences.service'
import { AuthHelper } from './auth.helper'
import * as DTO from './dto/auth.input'
import { EUserPresenceStatus, User } from '@prisma/client'
import { TransOauthDto } from './dto/transOauth.dto'
import { isEmail } from 'class-validator'
import { authenticator } from 'otplib'
import { toDataURL } from 'qrcode'
import { PubSub } from 'graphql-subscriptions'

const PUB_UPDATE_USERPRESENCE = `onUpdateUserPresence`

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPresencesService: UserPresencesService,
    private readonly pubSub: PubSub,
  ) {}

  //**************************************************//
  //  MUTATION
  //**************************************************//

  async signInLocal({
    email,
    password,
    doubleAuthCode,
  }: DTO.SignInLocalInput): Promise<User> {
    if (!password || password.length < 1) {
      throw new UnauthorizedException(`Password is a required field`)
    }
    if (!email || email.length < 4) {
      throw new UnauthorizedException(`you must provide a valid email`)
    }

    const user = await this.usersService.findOneByEmail(email)

    if (user === null) {
      throw new UnauthorizedException(`Invalid credentials`)
    }
    if ((await AuthHelper.validate(password, user.password)) === false) {
      throw new UnauthorizedException(`Invalid password`)
    }

    delete user.password
    if (user.doubleAuth == true && user.twoFactorAuthSecret) {
      if (!doubleAuthCode) throw new UnauthorizedException(`4242`)
      if (
        !(await this.isTwoFactorAuthenticationCodeValid(doubleAuthCode, user))
      )
        throw new UnauthorizedException(`Invalid 2FA code`)
    }
    const res = await this.userPresencesService.update(user.id, {
      userId: user.id,
      connected: EUserPresenceStatus.Online,
    })
    this.pubSub.publish(PUB_UPDATE_USERPRESENCE, res)
    return user
  }

  async signUpLocal({
    username,
    email,
    password,
  }: DTO.SignUpLocalInput): Promise<User> {
    if (!password || password.length < 1) {
      throw new BadRequestException(`Password is a required field`)
    }
    if (!email || !isEmail(email)) {
      throw new BadRequestException(`you must provide a valid email`)
    }
    if (await this.usersService.findOneByUsername(username)) {
      throw new BadRequestException(`Cannot register with '${username}'`)
    }
    if (await this.usersService.findOneByEmail(email)) {
      throw new BadRequestException(`Cannot register with '${email}'`)
    }
    const hashedPassword = await AuthHelper.hash(password)
    const qrObject = await this.generateTwoFactorAuthenticationSecret(email)
    const qrCodeBase64 = await this.generateQrCodeDataURL(qrObject.otpauthUrl)
    const user = await this.usersService.create({
      username: username,
      password: hashedPassword,
      email: email,
      twoFactorAuthSecret: qrObject.secret,
      googleAuthenticatorQrCode: qrCodeBase64,
      isOauth: false,
    })
    await this.userPresencesService.create({ userId: user.id })
    delete user.password
    return user
  }

  async validateUser(emailOrUsername: string, password: string) {
    const user =
      (await this.usersService.findOneByEmail(emailOrUsername)) ||
      (await this.usersService.findOneByUsername(emailOrUsername))

    if (user === null) {
      throw new UnauthorizedException(`Invalid credentials`)
    }
    if ((await AuthHelper.validate(password, user.password)) === false) {
      throw new UnauthorizedException(`Invalid password`)
    }

    delete user.password
    return user
  }

  async validateUserId(userId: string) {
    const usr = await this.usersService.findOne(userId)
    if (usr) {
      return usr
    }
    return null
  }

  async transOauthLogin(payload: TransOauthDto) {
    this.sanitize(payload)
    let dbUser = await this.usersService.findOneByEmail(payload.mail)
    // We enter login flow
    if (dbUser) {
      if (!dbUser.isOauth) {
        throw new UnauthorizedException(
          `This email is already used by a non-Oauth account`,
        )
      }
      if (dbUser.providerId != payload.providerUserId)
        throw new UnauthorizedException(
          `This email is already used by a another Oauth account`,
        )
    } else if (!dbUser) {
      // We enter signin flow
      const sanitizedPayload = await this.sanitizeForAccountCreation(payload)
      // lots of possible fields to add, need to change User class
      dbUser = await this.usersService.create({
        username: sanitizedPayload.username,
        email: sanitizedPayload.mail,
        avatarUrl: sanitizedPayload.avatar,
        providerName: sanitizedPayload.provider,
        providerId: sanitizedPayload.providerUserId,
        isOauth: true,
      })
      await this.userPresencesService.create({ userId: dbUser.id })
    }
    if (!dbUser) {
      throw new BadRequestException(`lé où l'user ?`)
    }
    const res = await this.userPresencesService.update(dbUser.id, {
      userId: dbUser.id,
      connected: EUserPresenceStatus.Online,
    })
    this.pubSub.publish(PUB_UPDATE_USERPRESENCE, res)
    return dbUser
  }

  async generateTwoFactorAuthenticationSecret(email: string) {
    const secret = await authenticator.generateSecret()

    const otpauthUrl = await authenticator.keyuri(
      email,
      `Transcendance`,
      secret,
    )

    return { otpauthUrl, secret }
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret,
    })
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return await toDataURL(otpAuthUrl)
  }

  //**************************************************//
  //  UTILS
  //**************************************************//

  private async findAvailableUsername(baseUserName: string) {
    let localUserName = baseUserName

    if (await this.usersService.findOneByUsername(baseUserName)) {
      let counter = 1
      while (await this.usersService.findOneByUsername(localUserName)) {
        localUserName = baseUserName + counter
        counter++
      }
    }

    return localUserName
  }

  private sanitize(payload: TransOauthDto) {
    if (!payload)
      throw new UnauthorizedException(`an error occured : cannot get payload`)
    if (!payload.mail)
      throw new UnauthorizedException(`the email provided is invalid`)
    if (!isEmail(payload.mail))
      throw new UnauthorizedException(`the email provided is invalid`)
    if (!payload.provider)
      throw new UnauthorizedException(`the oauth provider is unknow`)
    if (!payload.providerUserId)
      throw new UnauthorizedException(`the provided account does not exists`)
  }

  private buildAvatarUri(payload: TransOauthDto) {
    let res = ``
    if (payload.provider == `Discord`) {
      if (!payload.avatar) return ``
      res =
        `https://cdn.discordapp.com/avatars/` +
        payload.providerUserId +
        `/` +
        payload.avatar
    } else if (payload.provider == `Google`) {
      res = `https://img-4.linternaute.com/q_N1jQGmO8sUI6v2LOGFcRrXqpE=/1500x/smart/08e82cbcdf5a42c8b79808bc6b15792a/ccmcms-linternaute/48672760.jpg`
    } else if (payload.provider == `42` || payload.provider == `Github`) {
      res = payload.avatar
    }
    return res
  }

  private async sanitizeForAccountCreation(payload: TransOauthDto) {
    payload.avatar = await this.buildAvatarUri(payload)
    payload.username = await this.findAvailableUsername(payload.username)
    return payload
  }
}
