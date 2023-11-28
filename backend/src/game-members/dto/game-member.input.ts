import { Field, InputType } from '@nestjs/graphql'
//**************************************************//
//  MUTATION
//**************************************************//
@InputType()
export class CreateGameMemberInput {
  @Field(() => String)
  gameId: string
}

@InputType()
export class UpdateGameMemberInput {
  @Field(() => String)
  gameId: string
}

//**************************************************//
//  QUERY
//**************************************************//

//**************************************************//
//  SUBSCRIPTION
//**************************************************//
