import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { Strategy, VerifyCallback } from 'passport-42'
import { RedirectError } from '../custom-errors/redirect-errors'

const SCHOOL42_CLIENT_ID = process.env.SCHOOL42_CLIENT_ID
const SCHOOL42_CLIENT_SECRET = process.env.SCHOOL42_CLIENT_SECRET

@Injectable()
export class School42Strategy extends PassportStrategy(Strategy, `42`) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: SCHOOL42_CLIENT_ID,
      clientSecret: SCHOOL42_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + `/auth/42-redirect`,
      scope: [],
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
    profile = profile._json
    const userData = {
      provider: `42`,
      providerUserId: String(profile.id),
      mail: profile.email,
      username: profile.login,
      avatar: profile.image.link,
      locale: `fr`,
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
