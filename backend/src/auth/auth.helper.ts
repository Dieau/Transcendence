import { compare, genSalt, hash } from 'bcrypt'
import { verifyPassword } from './password.validator'
import { verifyChannelPassword } from './channelPassword.validator'

const SALT_OR_ROUNDS = 10

export class AuthHelper {
  static async validate(password: string, hash: string) {
    return await compare(password, hash)
  }

  static async hash(password: string) {
    verifyPassword(password)
    return await hash(password, await genSalt(SALT_OR_ROUNDS))
  }

  static async hashChannel(password: string) {
    verifyChannelPassword(password)
    return await hash(password, await genSalt(SALT_OR_ROUNDS))
  }
}
