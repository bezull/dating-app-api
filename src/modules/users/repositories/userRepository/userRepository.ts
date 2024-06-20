import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { User } from '../../domain/user'

export interface UserRepository {
  save(user: User): Promise<SuccessOrFailure<void>>
  saveBulk(users: User[]): Promise<SuccessOrFailure<void>>
  isEmailAlreadyInUse(email: string): Promise<boolean>
}
