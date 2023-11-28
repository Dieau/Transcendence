import { Module } from '@nestjs/common'
import { ChannelMessagesService } from './channel-messages.service'
import { ChannelMessagesResolver } from './channel-messages.resolver'
import { ChannelMembersModule } from 'src/channel-members/channel-members.module'

@Module({
  providers: [ChannelMessagesResolver, ChannelMessagesService],
  imports: [ChannelMembersModule],
})
export class ChannelMessagesModule {}
