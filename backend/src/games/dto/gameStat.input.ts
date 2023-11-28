import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class createGameStatInput {
	@Field(() => String)
	opponentId: string

	@Field(() => String)
	userScore: string

	@Field(() => String)
	opponentScore: string

	@Field(() => Boolean)
	isFakeData: boolean
}
