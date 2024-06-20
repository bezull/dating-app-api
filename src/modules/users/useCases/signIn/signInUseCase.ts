import { Either, Left, Right } from '../../../../shared/core/result/either'
import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { HashedPassword } from '../../domain/hashedPassword'
import { UserRepository } from '../../repositories/userRepository/userRepository'
import { AuthService } from '../../services/authService/authService'
import { SignInInputDTO, SignInOutputDTO } from './signInDTO'
import { EmailNotFound, InvalidCredential, SignInErrors } from './signInErrors'

export class SignInUseCase {
  #userRepository: UserRepository
  #authService: AuthService

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.#userRepository = userRepository
    this.#authService = authService
  }

  async execute(dto: SignInInputDTO): Promise<Either<SignInErrors, SuccessOrFailure<SignInOutputDTO>>> {
    const { email, password } = dto

    const emailExists = await this.#userRepository.isEmailAlreadyInUse(email)
    if (!emailExists) {
      return Left.create(new EmailNotFound())
    }

    const userResult = await this.#userRepository.getUserByEmail(email)
    if (userResult.isNotFound) {
      return Left.create(new EmailNotFound())
    }

    const user = userResult.getValue()

    const hashedPassword = await HashedPassword.compare(password, user.password)
    if (!hashedPassword) {
      return Left.create(new InvalidCredential())
    }

    const signedJwt = this.#authService.signJWT({
      userId: user.userId,
    })

    return Right.create(
      Result.ok({
        user: {
          email: user.email,
          name: user.name,
        },
        token: {
          access_token: signedJwt.token,
          expires_in: signedJwt.expires_at,
        },
      }),
    )
  }
}
