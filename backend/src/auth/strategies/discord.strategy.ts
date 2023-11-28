import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-discord'
import { VerifyCallback } from 'passport-discord-oauth2'
import { AuthService } from '../auth.service'
import { RedirectError } from '../custom-errors/redirect-errors'

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, `discord`) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + `/auth/discord-redirect`,
      scope: [`identify`, `email`],
      passReqToCallback: true,
    })
  }

  async validate(
    req,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const userData = {
      provider: `Discord`,
      providerUserId: profile.id,
      mail: profile.email,
      username: profile.username,
      avatar: profile.avatar,
      locale: profile.locale,
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
    return done(null, userData)
  }
}
