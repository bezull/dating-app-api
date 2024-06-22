import { Either, Left, Right } from '../../../../shared/core/result/either'
import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { UserRepository } from '../../../users/repositories/userRepository/userRepository'
import { DatingProfileMap } from '../../mappers/datingProfileMap'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { GetDatingProfileInputDTO, GetDatingProfileOutputDTO } from './getDatingProfileDTO'
import { DatingProfileNotFound, GetDatingProfileErrors, UserNotFound } from './getDatingProfileErrrors'

export type GetDatingProfileOutput = Either<GetDatingProfileErrors, SuccessOrFailure<GetDatingProfileOutputDTO>>

export class GetDatingProfileUseCase {
  #userRepo: UserRepository
  #datingProfileRepo: DatingProfileRepository

  constructor(userRepo: UserRepository, datingProfileRepo: DatingProfileRepository) {
    this.#userRepo = userRepo
    this.#datingProfileRepo = datingProfileRepo
  }

  async execute(dto: GetDatingProfileInputDTO): Promise<GetDatingProfileOutput> {
    const { userId } = dto
    const userResult = await this.#userRepo.getUserByUserId(userId)
    if (userResult.isNotFound) return Left.create(new UserNotFound())

    const datingProfileResult = await this.#datingProfileRepo.getDatingProfileByUserId(userId)
    if (datingProfileResult.isNotFound) return Left.create(new DatingProfileNotFound())

    return Right.create(Result.ok(DatingProfileMap.mapToDTO(datingProfileResult.getValue())))
  }
}
