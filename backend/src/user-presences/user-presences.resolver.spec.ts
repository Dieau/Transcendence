import { Test, TestingModule } from '@nestjs/testing'
import { UserPresencesResolver } from './user-presences.resolver'
import { UserPresencesService } from './user-presences.service'

describe(`UserPresencesResolver`, () => {
  let resolver: UserPresencesResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPresencesResolver, UserPresencesService],
    }).compile()

    resolver = module.get<UserPresencesResolver>(UserPresencesResolver)
  })

  it(`should be defined`, () => {
    expect(resolver).toBeDefined()
  })
})
