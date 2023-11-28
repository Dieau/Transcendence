import { InputType, Field } from '@nestjs/graphql'

//**************************************************//
//  MUTATION
//**************************************************//

@InputType()
export class SignInLocalInput {
  @Field(() => String)
  password: string

  @Field(() => String)
  email: string

  @Field(() => String)
  doubleAuthCode: string
}

@InputType()
export class SignUpLocalInput {
  @Field(() => String)
  password: string

  @Field(() => String)
  email: string

  @Field(() => String)
  username: string
}

@InputType()
export class GoogleAuthCodeValidatorInput {
  @Field(() => String)
  code: string
}

//**************************************************//
//  QUERY
//**************************************************//

//**************************************************//
//  SUBSCRIPTION
//**************************************************//
