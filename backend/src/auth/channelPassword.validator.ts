import { BadRequestException } from '@nestjs/common'

export function verifyChannelPassword(password: string) {
  const MIN_LENGTH = /^.{3,}$/.test(password)
  if (password === ``) {
    throw new Error(`Password is empty.`)
  } else if (!MIN_LENGTH) {
    throw new BadRequestException(
      `Password needs to be at least 3 characters long`,
    )
  }
}
