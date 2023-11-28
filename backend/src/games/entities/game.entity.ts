import { ObjectType, Field } from '@nestjs/graphql'
import { GameMember } from 'src/game-members/entities/game-member.entity'

@ObjectType()
export class Game {
  @Field(() => String)
  id: string

  @Field(() => String)
  message: string

  @Field(() => [GameMember], { nullable: true })
  gameMembers?: GameMember[]

  @Field(() => Boolean, { defaultValue: false })
  isDeleted: boolean

  @Field(() => String, { nullable: true })
  targetUserId: string

  @Field(() => Date)
  createdAt: Date
}
