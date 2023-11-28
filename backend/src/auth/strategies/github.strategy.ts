import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { Strategy } from 'passport-github2'
import { VerifyCallback } from 'passport-github'
import { RedirectError } from '../custom-errors/redirect-errors'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, `github`) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + `/auth/github-redirect`,
      scope: [`read:user`, `read:email`, `user:email`],
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
    const profilejson = profile._json
    const userData = {
      provider: `Github`,
      providerUserId: String(profilejson.id),
      mail: await this.getGithubUserMail(profile.emails),
      username: profilejson.login,
      avatar: profilejson.avatar_url, //dont work
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

  getGithubUserMail(emails) {
    if (emails[0].value) {
      return emails[0].value
    } else throw new UnauthorizedException(`can't get github mail`)
  }
}
