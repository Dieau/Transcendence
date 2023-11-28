import { Module, Global } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { EventEmitter } from 'events'

@Global()
@Module({
  providers: [
    {
      provide: PubSub,
      useFactory: () => {
        const emitter = new EventEmitter()
        emitter.setMaxListeners(0)
        const pubsub = new PubSub({ eventEmitter: emitter })
        return pubsub
      },
    },
  ],
  exports: [PubSub],
})
export class PubSubModule {}
