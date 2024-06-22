import { Either, Left, Right } from '../../../../shared/core/result/either'
import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { Logger } from '../../../../shared/infra/logger'
import { DatingProfile } from '../../domain/datingProfile'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { CreateDatingProfileInputDTO } from './createDatingProfileDTO'

import {
  CreateDatingProfileErrors,
  DuplicateDatingProfileError,
  FailCreatingDatingProfile,
} from './createDatingProfileErrors'

export type CreateDatingProfileOutput = Either<CreateDatingProfileErrors, SuccessOrFailure<void>>

export class CreateDatingProfileUseCase {
  #datingProfileRepo: DatingProfileRepository

  constructor(datingProfileRepo: DatingProfileRepository) {
    this.#datingProfileRepo = datingProfileRepo
  }

  async execute(dto: CreateDatingProfileInputDTO): Promise<CreateDatingProfileOutput> {
    const duplicateDatingProfileResult = await this.#datingProfileRepo.getDatingProfileByUserId(dto.userId)
    if (duplicateDatingProfileResult.isFound) return Left.create(new DuplicateDatingProfileError())

    const newDatingProfileResult = DatingProfile.create({
      userId: dto.userId,
      name: dto.name,
    })

    if (newDatingProfileResult.isFailure) return Left.create(new FailCreatingDatingProfile())

    const saveResult = await this.#datingProfileRepo.save(newDatingProfileResult.getValue())

    if (saveResult.isFailure) {
      Logger.error(`Error when executing ${CreateDatingProfileUseCase.name}`, saveResult.getErrorValue())
      return Left.create(new FailCreatingDatingProfile())
    }

    return Right.create(Result.ok())
  }
}
