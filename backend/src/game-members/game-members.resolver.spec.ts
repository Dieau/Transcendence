import { Test, TestingModule } from '@nestjs/testing'
import { GameMembersResolver } from './game-members.resolver'
import { GameMembersService } from './game-members.service'

describe(`GameMembersResolver`, () => {
  let resolver: GameMembersResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMembersResolver, GameMembersService],
    }).compile()

    resolver = module.get<GameMembersResolver>(GameMembersResolver)
  })

  it(`should be defined`, () => {
    expect(resolver).toBeDefined()
  })
})
