import { EUserRelationType, UserRelation, User } from '@prisma/client'
// import { UsersModule } from 'src/users/users.module'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserRelationsService } from './user-relations.service'
import { UsersService } from 'src/users/users.service'
import { UsersModule } from 'src/users/users.module'

describe(`UserRelationsService`, () => {
  let userRelationsService: UserRelationsService
  let usersService: UsersService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRelationsService],
      imports: [PrismaModule, UsersModule],
    }).compile()

    userRelationsService =
      module.get<UserRelationsService>(UserRelationsService)
    usersService = module.get<UsersService>(UsersService)
  })

  it(`Services should be defined`, () => {
    expect(userRelationsService).toBeDefined()
    expect(usersService).toBeDefined()
  })

  describe(`Test d'amitié`, () => {
    let userA: User
    let userB: User
    let relationA: UserRelation
    let relationB: UserRelation

    beforeAll(async () => {
      userA = await usersService.create({
        email: `userA@test.app`,
        username: `userA`,
      })
      userB = await usersService.create({
        email: `userB@test.app`,
        username: `userB`,
      })
    })

    describe(`Test de la demande d'ami`, () => {
      it(`Envoie de la demande`, async () => {
        await userRelationsService.createRequestFriend(userA.id, userB.id)
      })
      it(`La relation du UserA vers UserB a bien été créée`, async () => {
        relationA = await userRelationsService.findOne(userA.id, userB.id)
        expect(relationA).toBeDefined()
      })
      it(`La relation du UserA vers UserB est bien de type PendingAccept`, () => {
        expect(relationA.type).toBe(EUserRelationType.PendingAccept)
      })
      it(`La relation du UserB vers UserA a bien été créer`, async () => {
        relationB = await userRelationsService.findOne(userB.id, userA.id)
        expect(relationB).toBeDefined()
      })
      it(`La relation du UserB vers UserA est bien de type WaitingAccept`, () => {
        expect(relationB.type).toBe(EUserRelationType.WaitingAccept)
      })
      it(`Émission d'une erreur car la demande de UserA vers UserB a été renouvelée`, async () => {
        await expect(
          userRelationsService.createRequestFriend(userA.id, userB.id),
        ).rejects.toThrow()
      })
    })
    describe(`Test de l'acceptation d'amitié`, () => {
      beforeAll(async () => {
        //TODO
      })
    })
    describe(`Test du refus d'amitié`, () => {
      beforeAll(async () => {
        //TODO
      })
    })
    describe(`Test du bloquage de relation`, () => {
      beforeAll(async () => {
        //TODO
      })
    })
    describe(`Test du déblocage de relation`, () => {
      beforeAll(async () => {
        //TODO
      })
    })
    describe(`Test de la suppression d'amitié `, () => {
      beforeAll(async () => {
        //TODO
      })
    })

    afterAll(async () => {
      await usersService.delete(userA.id)
      await usersService.delete(userB.id)
    })
  })
})
