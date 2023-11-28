import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'

@ObjectType()
export class UserToken {
  @Field(() => String)
  token: string

  @Field(() => User)
  user: User
}
