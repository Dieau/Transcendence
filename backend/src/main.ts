import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'
import { RedirectFilter } from './auth/custom-errors/redirect-errors'
import * as session from 'express-session'
import * as passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.useGlobalFilters(new RedirectFilter())
  const prismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)
  await app.listen(8000)
}
bootstrap()
