import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth.service'

@Injectable()
export class DiscordOAuthGuard extends AuthGuard(`discord`) {
  constructor(private readonly authService: AuthService) {
    super({
      accessType: `offline`,
    })
  }
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean
    const request = context.switchToHttp().getRequest()
    await super.logIn(request)
    return activate
  }
}
