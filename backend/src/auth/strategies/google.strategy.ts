import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth2'
import { UsersService } from 'src/users/users.service'
import { AuthService } from '../auth.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { RedirectError } from '../custom-errors/redirect-errors'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, `google`) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + `/auth/google-redirect`,
      scope: [`email`, `profile`],
      passReqToCallback: true,
    })
  }
  async validate(
    req,
    accessToken,
    refreshToken,
    profile: any,
    done: VerifyCallback,
  ) {
    const profileJson = profile._json
    const userData = {
      provider: `Google`,
      providerUserId: profileJson.sub,
      mail: profileJson.email,
      username: profileJson.name,
      avatar: profileJson.picture,
      locale: profileJson.language,
    }
    try {
      const user = await this.authService.transOauthLogin(userData)
      return done(null, user)
    } catch (error) {
      console.error(`Error: `, error)
      throw new RedirectError(
        302,
        `${process.env.FRONTEND_URL}/login?error=` + error.message,
      )
      return done(error, null)
    }
  }
}
