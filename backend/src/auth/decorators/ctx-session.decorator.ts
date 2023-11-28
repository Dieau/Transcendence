import { GqlExecutionContext } from '@nestjs/graphql'
import { createParamDecorator } from '@nestjs/common'

export const CtxSession = createParamDecorator(
  (data, ctx) => GqlExecutionContext.create(ctx).getContext().req.session,
)
