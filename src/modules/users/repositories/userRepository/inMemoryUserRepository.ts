import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { User } from '../../domain/user'
import { UserRepository } from './userRepository'

export class InMemoryUserRepository implements UserRepository {
  #users: User[] = []

  async save(user: User): Promise<SuccessOrFailure<void>> {
    const existingIndex = this.#users.findIndex((mUser) => mUser.userId === user.userId)
    if (existingIndex != -1) {
      this.#users[existingIndex] = user
    } else {
      this.#users.push(user)
    }
    return Result.ok()
  }
  async saveBulk(users: User[]): Promise<SuccessOrFailure<void>> {
    users.map(async (user) => this.save(user))
    return Result.ok()
  }
  async isEmailAlreadyInUse(email: string): Promise<boolean> {
    return !this.#users.find((user) => user.email === email)
  }
}
