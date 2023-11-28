import { Test, TestingModule } from '@nestjs/testing'
import { GameMatchmakingMembersService } from './game-matchmaking-members.service'

describe(`GameMatchmakingMembersService`, () => {
  let service: GameMatchmakingMembersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMatchmakingMembersService],
    }).compile()

    service = module.get<GameMatchmakingMembersService>(
      GameMatchmakingMembersService,
    )
  })

  it(`should be defined`, () => {
    expect(service).toBeDefined()
  })
})
