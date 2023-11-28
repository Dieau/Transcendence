import { ObjectType, Field } from '@nestjs/graphql'
import { UserPublicGameInfos } from 'src/users/entities/user.entity'

@ObjectType()
export class GameMember {
  @Field(() => String)
  gameId: string

  @Field(() => String)
  userId: string

  @Field(() => UserPublicGameInfos)
  userGameInfos: UserPublicGameInfos

  @Field(() => Number)
  score: number
}
