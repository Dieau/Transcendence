import { INestApplication, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const process = require('node:process');

export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  enableShutdownHooks(app: INestApplication) {
    process.on(`beforeExit`, async () => {
      await app.close()
    })
  }
}
