import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { ChannelMembersService } from 'src/channel-members/channel-members.service'
import { ChannelsService } from './channels.service'

@Injectable()
export class ChannelsSecurity {
  constructor(
    private readonly channelsService: ChannelsService,
    @Inject(forwardRef(() => ChannelMembersService))
    private readonly channelMembersService: ChannelMembersService,
  ) {}

  /*async channelRW(channelId: string, userId: string): Promise<Boolean> {
    const channel = await this.channelsService.findOne(channelId)
    if (!channel) return false
    const member = await this.channelMembersService.findOne(channelId, userId)
    if (member === undefined || member.type === EChannelMemberType.Banned)
      return false
    return true
  }

  async channelR(channelId: string, userId?: string) {
    const channel = await this.channelsService.findOne(channelId)
    if (!channel) return false
    const member = await this.channelMembersService.findOne(channelId, userId)
    return false
  }*/
}
