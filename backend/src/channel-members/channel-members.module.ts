import { Module, forwardRef } from '@nestjs/common'
import { ChannelMembersService } from './channel-members.service'
import { ChannelMembersResolver } from './channel-members.resolver'
import { ChannelsModule } from 'src/channels/channels.module'

@Module({
  providers: [ChannelMembersResolver, ChannelMembersService],
  exports: [ChannelMembersService],
  imports: [forwardRef(() => ChannelsModule)],
})
export class ChannelMembersModule {}
