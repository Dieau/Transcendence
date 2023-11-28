import { Module, forwardRef } from '@nestjs/common'
import { UserRelationsService } from './user-relations.service'
import { UserRelationsResolver } from './user-relations.resolver'
import { ChannelsModule } from 'src/channels/channels.module'

@Module({
  providers: [UserRelationsResolver, UserRelationsService],
  exports: [UserRelationsService],
  imports: [forwardRef(() => ChannelsModule)],
})
export class UserRelationsModule {}
