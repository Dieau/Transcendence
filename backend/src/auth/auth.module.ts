import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { SessionSerializer } from './utils/serializer'
import { DiscordStrategy } from './strategies/discord.strategy'
import { GithubStrategy } from './strategies/github.strategy'
import { School42Strategy } from './strategies/school42.strategy'
import { UserPresencesModule } from 'src/user-presences/user-presences.module'

@Module({
  providers: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    GoogleStrategy,
    DiscordStrategy,
    GithubStrategy,
    School42Strategy,
    SessionSerializer,
    {
      provide: `AUTH_SERVICE`,
      useClass: AuthService,
    },
  ],
  imports: [
    UsersModule,
    UserPresencesModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
