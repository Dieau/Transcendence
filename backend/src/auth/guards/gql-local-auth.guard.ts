import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from '../auth.service'

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard(`local`) {
	constructor(private readonly authService: AuthService) {
		super()
	}

	getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context)
		const gqlReq = ctx.getContext().req
		const {
			args: { email, password, doubleAuthCode },
		} = ctx.getArgs()
		gqlReq.body.email = email
		gqlReq.body.password = password
		gqlReq.body.doubleAuthCode = doubleAuthCode
		return gqlReq
	}

	async canActivate(context: ExecutionContext) {
		const activate = (await super.canActivate(context)) as boolean
		const ctx = GqlExecutionContext.create(context)
		const gqlReq = ctx.getContext().req
		const {
			args: { email, password, doubleAuthCode },
		} = ctx.getArgs()
		gqlReq.body.email = email
		gqlReq.body.password = password
		gqlReq.body.doubleAuthCode = doubleAuthCode
		if (gqlReq.user.doubleAuth && gqlReq.user.twoFactorAuthSecret) {
			//change for true
			if (!doubleAuthCode) {
				return activate
			} else if (
				await this.authService.isTwoFactorAuthenticationCodeValid(
					doubleAuthCode,
					gqlReq.user,
				)
			) {
				await super.logIn(gqlReq)
				return activate
			}
		} else {
			await super.logIn(gqlReq)
			return activate
		}
	}
}
