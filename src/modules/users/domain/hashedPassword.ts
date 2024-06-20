import bcrypt from 'bcrypt'
import { SuccessOrFailure } from '../../../shared/core/result/successOrFailureResult'
import { Result } from '../../../shared/core/result/result'

const SALT_ROUNDS = 10

export class HashedPassword {
  #value: string

  constructor(value: string) {
    this.#value = value
  }

  get value() {
    return this.#value
  }

  static create(value: string): HashedPassword {
    return new HashedPassword(value)
  }

  static async hash(value: string): Promise<SuccessOrFailure<HashedPassword>> {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS)
      const hash = bcrypt.hashSync(value, salt)
      return Result.ok(new HashedPassword(hash))
    } catch (error) {
      console.error('Error hashing password:', error)
      return Result.fail('Failed to hash password')
    }
  }

  static async compare(value: string, hash: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(value, hash)
      return isValid
    } catch (error) {
      console.error('Error comparing password:', error)
      return false
    }
  }
}
