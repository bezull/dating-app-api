import { defineFeature, loadFeature } from 'jest-cucumber'
import { User } from '../../../users/domain/user'
import { InMemoryUserRepository } from '../../../users/repositories/userRepository/inMemoryUserRepository'
import { UserRepository } from '../../../users/repositories/userRepository/userRepository'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'
import { DailyDatingProfileInteraction } from '../../domain/dailyDatingProfileInteraction'
import { DatingProfile } from '../../domain/datingProfile'
import { DailyDatingProfileInteractionRepository } from '../../repositories/dailyDatingProfileInteractionRepository/dailyDatingProfileInteractionRepository'
import { InMemoryDailyDatingProfileInteractionRepository } from '../../repositories/dailyDatingProfileInteractionRepository/inMemoryDailyDatingProfileInteractionRepository'
import { DailyDatingProfileRepository } from '../../repositories/dailyDatingProfileRepository/dailyDatingProfileRepository'
import { InMemoryDailyDatingProfileRepository } from '../../repositories/dailyDatingProfileRepository/inMemoryDailyDatingProfileRepository'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { InMemoryDatingProfileRepository } from '../../repositories/datingProfileRepository/inMemoryDatingProfileRepository'
import { SwipeLeftDatingProfileOutput, SwipeLeftDatingProfileUseCase } from './swipeLeftDatingProfileUseCase'

const feature = loadFeature('./tests/acceptance/matches/swipeLeftDatingProfile/swipeLeftDatingProfile.feature')

defineFeature(feature, (test) => {
  const userRepo: UserRepository = new InMemoryUserRepository()
  const datingProfileRepo: DatingProfileRepository = new InMemoryDatingProfileRepository()
  const dailyDatingProfileRepo: DailyDatingProfileRepository = new InMemoryDailyDatingProfileRepository()
  const dailyDatingProfileInteractionRepo: DailyDatingProfileInteractionRepository =
    new InMemoryDailyDatingProfileInteractionRepository()

  const useCase = new SwipeLeftDatingProfileUseCase(
    datingProfileRepo,
    dailyDatingProfileRepo,
    dailyDatingProfileInteractionRepo,
  )

  let useCaseResult: SwipeLeftDatingProfileOutput

  const fakeUserOne = User.create({
    name: 'Fake User',
    email: 'fakeuser@gmail.com',
    password: 'password1',
  }).getValue()

  const fakeUserOneDatingProfile = DatingProfile.create({
    name: 'Fake',
    userId: fakeUserOne.userId,
  }).getValue()

  const fakeUserTwo = User.create({
    name: 'Fake User Two',
    email: 'fakeusertwo@gmail.com',
    password: 'password1',
  }).getValue()

  const fakeUserTwoDatingProfile = DatingProfile.create({
    name: 'Fake Two',
    userId: fakeUserTwo.userId,
  }).getValue()

  test('successfully swipe left dating profile', ({ given, when, then, and }) => {
    given('seed new user and dating profile', async () => {
      await userRepo.saveBulk([fakeUserOne, fakeUserTwo])
      await datingProfileRepo.saveBulk([fakeUserOneDatingProfile, fakeUserTwoDatingProfile])
    })

    when('swipe left dating profile', async () => {
      useCaseResult = await useCase.execute({
        userId: fakeUserOne.userId,
        datingProfileId: fakeUserTwoDatingProfile.datingProfileId,
      })
    })

    then('should successfully swipe left dating profile', () => {
      expect(useCaseResult.isRight()).toBe(true)
    })

    and(/^dating profile total pass increased by (.*)$/, async (increment: number) => {
      const datingProfileAfterSwipeLeft = (
        await datingProfileRepo.getDatingProfileByUserId(fakeUserTwo.userId)
      ).getValue()
      expect(datingProfileAfterSwipeLeft.totalPass).toBe(Number(increment))
    })
  })
  test('error swipe left dating profile due to already interacted today', ({ given, when, then }) => {
    given('seed new user, dating profile, daily dating profile, and daily dating profile interaction', async () => {
      await userRepo.saveBulk([fakeUserOne, fakeUserTwo])
      await datingProfileRepo.saveBulk([fakeUserOneDatingProfile, fakeUserTwoDatingProfile])

      const dailyDatingProfile = DailyDatingProfile.create({
        userId: fakeUserOne.userId,
      }).getValue()
      const dailyDatingProfileInteraction = DailyDatingProfileInteraction.create({
        dailyDatingProfileId: dailyDatingProfile.dailyDatingProfileId,
        datingProfileId: fakeUserTwoDatingProfile.datingProfileId,
        isLiked: false,
      }).getValue()

      await dailyDatingProfileRepo.save(dailyDatingProfile)
      await dailyDatingProfileInteractionRepo.save(dailyDatingProfileInteraction)
    })

    when('swipe left dating profile', async () => {
      useCaseResult = await useCase.execute({
        userId: fakeUserOne.userId,
        datingProfileId: fakeUserTwoDatingProfile.datingProfileId,
      })
    })

    then('should return error swipe left dating profile due to already interacted today', () => {
      expect(useCaseResult.isLeft()).toBe(true)
      if (useCaseResult.isLeft()) {
        expect(useCaseResult.error.getErrorValue()).toBe('Dating profile already interacted today')
      }
    })
  })
})
