import { BadRequestException } from '@nestjs/common'

export function verifyPassword(password: string) {
  const MIN_LENGTH = /^.{8,}$/.test(password)
  const MAX_LENGTH = /^.{0,16}$/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasDigit = /[0-9]/.test(password)

  if (password === ``) {
    throw new Error(`Password is empty.`)
  } else if (!MIN_LENGTH) {
    throw new BadRequestException(
      `Password needs to be at least 8 characters long`,
    )
  } else if (!MAX_LENGTH) {
    throw new BadRequestException(`Password cannot exceed 16 characters.`)
  } else if (!hasUppercase) {
    throw new BadRequestException(
      `Password must contain at least one uppercase character.`,
    )
  } else if (!hasLowercase) {
    throw new BadRequestException(
      `Password must contain at least one lowercase character.`,
    )
  } else if (!hasDigit) {
    throw new BadRequestException(`Password must contain at least one digit`)
  }
}
