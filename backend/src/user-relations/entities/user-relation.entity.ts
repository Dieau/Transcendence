import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql'
import { EUserRelationType, User } from '@prisma/client'
import {
  UserPublic,
  UserPublicGameInfos,
} from '../../users/entities/user.entity'

@ObjectType()
export class UserRelation {
  @Field(() => ID)
  userOwnerId: string

  @Field(() => UserPublic, { nullable: true })
  userOwner: User

  @Field(() => String)
  userTargetId: string

  @Field(() => UserPublic, { nullable: true })
  userTarget: User

  @Field(() => EUserRelationType)
  type: EUserRelationType

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => UserPublicGameInfos)
  friendInfos: UserPublicGameInfos
}

registerEnumType(EUserRelationType, {
  name: `EUserRealtionType`,
})
