import { InputType, Field } from '@nestjs/graphql'

//**************************************************//
//  MUTATION
//**************************************************//

@InputType()
export class UpdateMyUserInput {
  @Field(() => Boolean, { nullable: true })
  doubleAuth?: boolean

  @Field(() => String, { nullable: true })
  username?: string

  @Field(() => String, { nullable: true })
  avatarUrl: string
}

@InputType()
export class UpdateMyPasswordInput {
  @Field(() => String)
  newPassword: string
}
//**************************************************//
//  QUERY
//**************************************************//

@InputType()
export class FindUserInput {
  @Field(() => String)
  id: string
}

@InputType()
export class CheckPseudoInput {
  @Field(() => String)
  pseudo: string
}

//**************************************************//
//  SUBSCRIPTION
//**************************************************//
