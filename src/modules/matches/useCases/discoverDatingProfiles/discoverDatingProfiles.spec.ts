import { defineFeature, loadFeature } from 'jest-cucumber'
import { v4 as uuidv4 } from 'uuid'
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
import { DiscoverDatingProfilesOutput, DiscoverDatingProfilesUseCase } from './discoverDatingProfilesUseCase'

const feature = loadFeature('./tests/acceptance/matches/discoverDatingProfiles/discoverDatingProfiles.feature')

defineFeature(feature, (test) => {
  const userRepo: UserRepository = new InMemoryUserRepository()
  const datingProfileRepo: DatingProfileRepository = new InMemoryDatingProfileRepository()
  const dailyDatingProfileRepo: DailyDatingProfileRepository = new InMemoryDailyDatingProfileRepository()
  const dailyDatingProfileInteractionRepo: DailyDatingProfileInteractionRepository =
    new InMemoryDailyDatingProfileInteractionRepository()

  const useCase = new DiscoverDatingProfilesUseCase(
    datingProfileRepo,
    dailyDatingProfileRepo,
    dailyDatingProfileInteractionRepo,
  )

  let useCaseResult: DiscoverDatingProfilesOutput

  const fakeUser = User.create({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'password1',
  }).getValue()

  const datingProfiles: DatingProfile[] = []

  beforeAll(async () => {
    await userRepo.save(fakeUser)

    for (let index = 0; index < 10; index++) {
      datingProfiles.push(
        DatingProfile.create({
          name: 'Fake' + index,
          userId: uuidv4(),
        }).getValue(),
      )
    }

    await datingProfileRepo.saveBulk(datingProfiles)
  })

  test('successfully discover dating profiles', ({ given, when, then }) => {
    const userId: string = uuidv4()
    given('seed new user and dating profile', async () => {
      const newUser = User.create(
        {
          name: 'Fake User',
          email: 'fakeuser@gmail.com',
          password: 'password1',
        },
        userId,
      ).getValue()
      const newDatingProfile = DatingProfile.create({
        userId: userId,
        name: 'Fake User',
      }).getValue()

      await userRepo.save(newUser)
      await datingProfileRepo.save(newDatingProfile)
    })

    when('discover dating profiles using newly seeded user id', async () => {
      useCaseResult = await useCase.execute({
        userId: userId,
      })
    })

    then('should return dating profiles', () => {
      expect(useCaseResult.isRight()).toBeTruthy()
      if (useCaseResult.isRight()) {
        expect(useCaseResult.value.datingProfiles)
        expect(useCaseResult.value.datingProfiles.length).toBe(10)
      }
    })
  })

  test("successfully discover dating profiles that haven't been interacted", ({ given, when, then }) => {
    const userId: string = uuidv4()
    given('seed new user, dating profile, daily dating profile, and daily dating profile interaction', async () => {
      const newUser = User.create(
        {
          name: 'Fake User 2',
          email: 'fakeuser@gmail.com',
          password: 'password1',
        },
        userId,
      ).getValue()

      const newDatingProfile = DatingProfile.create({
        userId: userId,
        name: newUser.name,
      }).getValue()

      const newDailyDatingProfile = DailyDatingProfile.create({
        userId: userId,
      }).getValue()

      const newDailyDatingProfileInteractions: DailyDatingProfileInteraction[] = datingProfiles.map((data) => {
        return DailyDatingProfileInteraction.create({
          dailyDatingProfileId: newDailyDatingProfile.dailyDatingProfileId,
          datingProfileId: data.datingProfileId,
          isLiked: true,
        }).getValue()
      })

      await userRepo.save(newUser)
      await datingProfileRepo.save(newDatingProfile)
      await dailyDatingProfileRepo.save(newDailyDatingProfile)
      await dailyDatingProfileInteractionRepo.saveBulk(newDailyDatingProfileInteractions)
    })

    when('discover dating profiles using newly seeded user id', async () => {
      useCaseResult = await useCase.execute({ userId })
    })

    then("should return dating profiles that hasn't been interacted", () => {
      expect(useCaseResult.isRight()).toBeTruthy()
      if (useCaseResult.isRight()) {
        expect(useCaseResult.value.datingProfiles.length).toBe(1)
      }
    })
  })
})
