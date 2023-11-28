import { Test, TestingModule } from '@nestjs/testing'
import { UserPresencesService } from './user-presences.service'

describe(`UserPresencesService`, () => {
  let service: UserPresencesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPresencesService],
    }).compile()

    service = module.get<UserPresencesService>(UserPresencesService)
  })

  it(`should be defined`, () => {
    expect(service).toBeDefined()
  })
})
