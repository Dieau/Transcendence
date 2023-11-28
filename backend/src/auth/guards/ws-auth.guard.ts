import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class WsAuthGuard extends AuthGuard(`local`) {
  constructor() {
    super()
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake
  }
}
