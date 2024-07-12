import { Either, Left, Right } from '../../../../shared/core/result/either'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'
import { DailyDatingProfileInteraction } from '../../domain/dailyDatingProfileInteraction'
import { DailyDatingProfileInteractionRepository } from '../../repositories/dailyDatingProfileInteractionRepository/dailyDatingProfileInteractionRepository'
import { DailyDatingProfileRepository } from '../../repositories/dailyDatingProfileRepository/dailyDatingProfileRepository'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'
import { DuplicatedDatingProfileInteracted } from '../swipeLeftDatingProfile/swipeLeftDatingProfileErrors'
import { SwipeRightDatingProfileInputDTO } from './swipeRightDatingProfileDTO'
import { SwipeRightDatingProfileErrors } from './swipeRightDatingProfileErrors'

export type SwipeRightDatingProfileOutput = Either<SwipeRightDatingProfileErrors, string>

export class SwipeRightDatingProfileUseCase {
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

  async execute(dto: SwipeRightDatingProfileInputDTO): Promise<SwipeRightDatingProfileOutput> {
    const { userId, datingProfileId } = dto

    const userDatingProfileResult = await this.#datingProfileRepository.getDatingProfileByUserId(userId)
    if (userDatingProfileResult.isNotFound) {
      return Left.create(new DatingProfileNotFound())
    }

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

    const isDatingProfileInteracted = await this.#dailyDatingProfileInteractionRepository.isDatingProfileInteracted(
      todayDaily.dailyDatingProfileId,
      datingProfileId,
    )

    if (isDatingProfileInteracted) {
      return Left.create(new DuplicatedDatingProfileInteracted())
    }

    const targetDatingProfileResult = await this.#datingProfileRepository.getDatingProfileByFilter({
      datingProfileId,
    })

    if (targetDatingProfileResult.isNotFound) {
      return Left.create(new DatingProfileNotFound())
    }

    const targetDatingProfile = targetDatingProfileResult.getValue()

    const dailyDatingProfileInteraction = DailyDatingProfileInteraction.create({
      dailyDatingProfileId: todayDaily.dailyDatingProfileId,
      datingProfileId: targetDatingProfile.datingProfileId,
      isLiked: false,
    }).getValue()

    targetDatingProfile.addLike()

    await this.#dailyDatingProfileInteractionRepository.save(dailyDatingProfileInteraction)
    await this.#datingProfileRepository.save(targetDatingProfile)

    return Right.create('Successfully swipe right dating profile')
  }
}
