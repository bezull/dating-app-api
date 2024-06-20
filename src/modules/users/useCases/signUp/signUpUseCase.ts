import { Either, Left, Right } from '../../../../shared/core/result/either'
import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { User } from '../../domain/user'
import { UserRepository } from '../../repositories/userRepository/userRepository'
import { SignUpUseCaseInputDTO, SignUpUseCaseOutputDTO } from './signUpUseCaseDTO'
import { DuplicateEmailError, SignUpUseCaseErrors } from './signUpUseCaseErrors'

export class SignUpUseCase {
  #userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.#userRepository = userRepository
  }

  async execute(
    data: SignUpUseCaseInputDTO,
  ): Promise<Either<SignUpUseCaseErrors, SuccessOrFailure<SignUpUseCaseOutputDTO>>> {
    const emailExists = await this.#userRepository.isEmailAlreadyInUse(data.email)
    if (emailExists) {
      return Left.create(new DuplicateEmailError())
    }

    const userOrError = User.create({
      email: data.email,
      password: data.password,
      name: data.name,
    })

    if (userOrError.isFailure) {
      return Left.create(Result.fail('Error when creating user'))
    }
    const user = userOrError.getValue()
    await this.#userRepository.save(userOrError.getValue())

    return Right.create(
      Result.ok({
        id: user.userId,
        email: user.email,
        name: user.name,
      }),
    )
  }
}
