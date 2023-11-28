import { PassportSerializer } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(`AUTH_SERVICE`) private readonly authService: AuthService,
  ) {
    super()
  }

  serializeUser(user: any, done: Function) {
    done(null, user)
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.validateUserId(payload.id)
    return done(null, user ?? null)
  }
}
