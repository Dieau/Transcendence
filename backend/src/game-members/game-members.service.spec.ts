import { Test, TestingModule } from '@nestjs/testing'
import { GameMembersService } from './game-members.service'

describe(`GameMembersService`, () => {
  let service: GameMembersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMembersService],
    }).compile()

    service = module.get<GameMembersService>(GameMembersService)
  })

  it(`should be defined`, () => {
    expect(service).toBeDefined()
  })
})
