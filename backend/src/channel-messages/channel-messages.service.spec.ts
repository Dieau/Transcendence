import { Test, TestingModule } from '@nestjs/testing'
import { ChannelMessagesService } from './channel-messages.service'

describe(`ChannelMessagesService`, () => {
  let service: ChannelMessagesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelMessagesService],
    }).compile()

    service = module.get<ChannelMessagesService>(ChannelMessagesService)
  })

  it(`should be defined`, () => {
    expect(service).toBeDefined()
  })
})
