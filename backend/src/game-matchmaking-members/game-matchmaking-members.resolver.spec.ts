import { Test, TestingModule } from '@nestjs/testing'
import { GameMatchmakingMembersResolver } from './game-matchmaking-members.resolver'
import { GameMatchmakingMembersService } from './game-matchmaking-members.service'

describe(`GameMatchmakingMembersResolver`, () => {
  let resolver: GameMatchmakingMembersResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameMatchmakingMembersResolver,
        GameMatchmakingMembersService,
      ],
    }).compile()

    resolver = module.get<GameMatchmakingMembersResolver>(
      GameMatchmakingMembersResolver,
    )
  })

  it(`should be defined`, () => {
    expect(resolver).toBeDefined()
  })
})
