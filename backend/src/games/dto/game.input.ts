import { Field, InputType } from '@nestjs/graphql'

//**************************************************//
//  MUTATION
//**************************************************//

@InputType()
export class CreateGameInput {
  @Field(() => String, { nullable: true })
  message: string

  @Field(() => String, { nullable: true })
  userTargetId: string
}

@InputType()
export class UpdateGameInput {
  @Field(() => String)
  id: string
}

@InputType()
export class DeleteGameInput {
  @Field(() => String)
  id: string
}

@InputType()
export class JoinGameInput {
  @Field(() => String)
  id: string
}

@InputType()
export class LeaveGameInput {
  @Field(() => String)
  id: string
}

//**************************************************//
//  QUERY
//**************************************************//

//**************************************************//
//  SUBSCRIPTION
//**************************************************//
