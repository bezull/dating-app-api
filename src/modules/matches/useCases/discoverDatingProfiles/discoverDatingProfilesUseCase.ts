import { Either, Left, Right } from '../../../../shared/core/result/either'
import { Result } from '../../../../shared/core/result/result'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'
import { DatingProfileMap } from '../../mappers/datingProfileMap'
import { DailyDatingProfileInteractionRepository } from '../../repositories/dailyDatingProfileInteractionRepository/dailyDatingProfileInteractionRepository'
import { DailyDatingProfileRepository } from '../../repositories/dailyDatingProfileRepository/dailyDatingProfileRepository'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { DiscoverDatingProfilesInputDTO, DiscoverDatingProfilesOutputDTO } from './discoverDatingProfilesDTO'
import { DiscoverDatingProfileErrors } from './discoverDatingProfilesErrors'

export type DiscoverDatingProfilesOutput = Either<DiscoverDatingProfileErrors, DiscoverDatingProfilesOutputDTO>

export class DiscoverDatingProfilesUseCase {
  #datingProfileRepository: DatingProfileRepository
  #dailyDatingProfileRepository: DailyDatingProfileRepository
  #dailyDatingProfileInteractionRepository: DailyDatingProfileInteractionRepository

  constructor(
    datingProfileRepository: DatingProfileRepository,
    dailyDatingProfileRepository: DailyDatingProfileRepository,
    dailyDatingProfileInteractionRepository: DailyDatingProfileInteractionRepository,
  ) {
    this.#datingProfileRepository = datingProfileRepository
    this.#dailyDatingProfileRepository = dailyDatingProfileRepository
    this.#dailyDatingProfileInteractionRepository = dailyDatingProfileInteractionRepository
  }

  async execute(dto: DiscoverDatingProfilesInputDTO): Promise<DiscoverDatingProfilesOutput> {
    const { userId } = dto

    const userDatingProfileResult = await this.#datingProfileRepository.getDatingProfileByUserId(userId)
    if (userDatingProfileResult.isNotFound) {
      return Left.create(Result.fail(userDatingProfileResult.getErrorValue()))
    }

    const userDatingProfile = userDatingProfileResult.getValue()

    const todayDailyResult = await this.#dailyDatingProfileRepository.getTodayDailyDatingProfileByUserId(userId)
    let todayDaily: DailyDatingProfile
    if (todayDailyResult.isNotFound) {
      todayDaily = DailyDatingProfile.create({
        userId: userId,
      }).getValue()

      await this.#dailyDatingProfileRepository.save(todayDaily)
    } else {
      todayDaily = todayDailyResult.getValue()
    }

    const interactedDailyDatingProfileIds =
      await this.#dailyDatingProfileInteractionRepository.getDatingProfileIdsByDailyDatingProfileId(
        todayDaily.dailyDatingProfileId,
        userDatingProfile.datingProfileId,
      )

    interactedDailyDatingProfileIds.push(userDatingProfile.datingProfileId)

    const uninteractedDatingProfiles = await this.#datingProfileRepository.getUninteractedDatingProfiles(
      interactedDailyDatingProfileIds,
      userDatingProfile.datingProfileId,
    )

    const outputDTO: DiscoverDatingProfilesOutputDTO = {
      limit: uninteractedDatingProfiles.length,
      datingProfiles: uninteractedDatingProfiles.map((datingProfile) => DatingProfileMap.mapToDTO(datingProfile)),
    }

    return Right.create(outputDTO)
  }
}
