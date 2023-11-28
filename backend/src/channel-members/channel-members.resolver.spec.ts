import { Test, TestingModule } from '@nestjs/testing'
import { ChannelMembersResolver } from './channel-members.resolver'
import { ChannelMembersService } from './channel-members.service'

describe(`ChannelMembersResolver`, () => {
  let resolver: ChannelMembersResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelMembersResolver, ChannelMembersService],
    }).compile()

    resolver = module.get<ChannelMembersResolver>(ChannelMembersResolver)
  })

  it(`should be defined`, () => {
    expect(resolver).toBeDefined()
  })
})
