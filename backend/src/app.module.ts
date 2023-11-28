import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloDriver } from '@nestjs/apollo/dist/drivers'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { UsersModule } from './users/users.module'
import { UserPresencesModule } from './user-presences/user-presences.module'
import { AuthModule } from './auth/auth.module'
import { GameMatchmakingMembersModule } from './game-matchmaking-members/game-matchmaking-members.module'
import { GameMembersModule } from './game-members/game-members.module'
import { GamesModule } from './games/games.module'
import { ChannelMessagesModule } from './channel-messages/channel-messages.module'
import { ChannelMembersModule } from './channel-members/channel-members.module'
import { ChannelsModule } from './channels/channels.module'
import { UserRelationsModule } from './user-relations/user-relations.module'
import { PubSubModule } from './pub-sub/pub-sub.module'
import { PassportModule } from '@nestjs/passport'
import { AppGateway } from './app.gateway'
import { UserPresencesService } from './user-presences/user-presences.service'
import { GamesService } from './games/games.service'
import { GameMembersService } from './game-members/game-members.service'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: `schema.gql`,
      subscriptions: {
        'graphql-ws': {
          path: `/graphql`,
        },
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    PrismaModule,
    UsersModule,
    UserPresencesModule,
    UserRelationsModule,
    ChannelsModule,
    ChannelMembersModule,
    ChannelMessagesModule,
    GameMembersModule,
    GameMatchmakingMembersModule,
    AuthModule,
    GamesModule,
    PubSubModule,
    PassportModule.register({ session: true }),
  ],
  providers: [
    AppGateway,
    UserPresencesService,
    GamesService,
    GameMembersService,
  ],
  //controllers: [AppController],
})
export class AppModule { }
