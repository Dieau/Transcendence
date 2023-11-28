import { Test, TestingModule } from '@nestjs/testing'
import { ChannelMessagesResolver } from './channel-messages.resolver'
import { ChannelMessagesService } from './channel-messages.service'

describe(`ChannelMessagesResolver`, () => {
  let resolver: ChannelMessagesResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelMessagesResolver, ChannelMessagesService],
    }).compile()

    resolver = module.get<ChannelMessagesResolver>(ChannelMessagesResolver)
  })

  it(`should be defined`, () => {
    expect(resolver).toBeDefined()
  })
})
