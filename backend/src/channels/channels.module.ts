import { ChannelMembersModule } from './../channel-members/channel-members.module'
import { Module, forwardRef } from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { ChannelsResolver } from './channels.resolver'
import { ChannelsSecurity } from './channels.security'
import { UserRelationsModule } from 'src/user-relations/user-relations.module'

@Module({
  providers: [ChannelsResolver, ChannelsService, ChannelsSecurity],
  exports: [ChannelsService],
  imports: [
    forwardRef(() => ChannelMembersModule),
    forwardRef(() => UserRelationsModule),
  ],
})
export class ChannelsModule {}
