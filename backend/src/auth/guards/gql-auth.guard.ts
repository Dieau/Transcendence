import { Injectable, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { UserPresencesService } from 'src/user-presences/user-presences.service'

@Injectable()
export class GqlAuthGuard extends AuthGuard(`local`) {
  constructor(private userPresencesService: UserPresencesService) {
    super()
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.isAuthenticated()
  }
}
