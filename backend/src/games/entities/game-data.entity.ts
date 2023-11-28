import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Game } from 'src/games/entities/game.entity'
import { User } from 'src/users/entities/user.entity'

@ObjectType()
export class PlayerData {
  constructor(data: Partial<PlayerData>) {
    this.update(data)
  }

  @Field(() => Int)
  position: number

  @Field(() => String)
  userId: string

  public update(data: Partial<PlayerData>) {
    return Object.assign(this, data)
  }
}

@ObjectType()
export class GameData extends Game {
  constructor(data: Game) {
    super()
    this.update(data)
  }

  private players = new Map<string, PlayerData>()

  public update(data: Partial<Game>) {
    return Object.assign(this, data)
  }

  public join(user: User) {
    if (this.gameMembers.find((e) => e.userId === user.id) === null) {
      throw new UnauthorizedException(`You cannot join this game`)
    }
    if (this.players.has(user.id)) {
      throw new BadRequestException(`You have already joined the game`)
    }
    this.players.set(user.id, new PlayerData({ userId: user.id }))
    return this
  }

  public leave(user: User) {
    if (this.players.has(user.id)) {
      throw new BadRequestException(`The player does not exist`)
    }
    return this.players.delete(user.id)
  }

  public updatePlayer(user: User, data: Partial<PlayerData>) {
    return this.findPlayer(user).update(data)
  }

  private findPlayer(user: User) {
    if (this.players.has(user.id)) {
      throw new BadRequestException(`The player does not exist`)
    }
    return this.players.get(user.id)
  }
}
