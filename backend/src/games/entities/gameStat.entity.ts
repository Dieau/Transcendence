import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class GameStat {
	@Field(() => String, { nullable: true })
	id: string

	@Field(() => Boolean, { defaultValue: false })
	isDeleted: Boolean

	@Field(() => String, { nullable: true })
	userId: String

	@Field(() => String, { nullable: true })
	opponentId: String

	@Field(() => Boolean, { nullable: true })
	isWinner: Boolean

	@Field(() => String, { nullable: true })
	userScore: String

	@Field(() => String, { nullable: true })
	opponentScore: String

	@Field(() => String, { nullable: true })
	createdAt: String
}
