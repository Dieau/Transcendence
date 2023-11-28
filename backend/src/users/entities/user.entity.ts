import { ObjectType, Field } from '@nestjs/graphql'
import { GameStat } from 'src/games/entities/gameStat.entity'

@ObjectType()
export class UserPublic {
  @Field(() => String)
  id: string

  @Field(() => String)
  username: string

  @Field(() => String, { nullable: true })
  avatarUrl?: string

  // @Field(() => String)
  // wincount: string
}

@ObjectType()
export class User extends UserPublic {
  @Field(() => Boolean)
  doubleAuth: boolean

  @Field(() => Boolean)
  isOauth: boolean
}

@ObjectType()
export class UserTwoFaSettings {
  @Field(() => String)
  googleAuthenticatorQrCode: string
}


@ObjectType()
export class GameRatio {
  @Field(() => Date)
  date: Date

  @Field(() => Number)
  ratio: number
}

@ObjectType()
export class UserGameStats {
  @Field(() => [GameStat])
  gameStats: GameStat[]
}

@ObjectType()
export class GeneralUserGameStats {
  @Field(() => Number)
  gamesCount: number

  @Field(() => Number)
  allTimeRatio: number

  @Field(() => Number)
  MeanPoints: number

  @Field(() => Number)
  leaderBoardPosition: number
}

@ObjectType()
export class UserPublicGameInfos {
  @Field(() => String)
  id: string

  @Field(() => String)
  username: string

  @Field(() => String)
  avatarUrl: string

  @Field(() => Number)
  ratio: number
}

@ObjectType()
export class LeaderBoardUser {
  @Field(() => String)
  id: string

  @Field(() => String)
  username: string

  @Field(() => String)
  avatarUrl: string

  @Field(() => Number)
  ratio: number

  @Field(() => Number)
  winrate: number
}
