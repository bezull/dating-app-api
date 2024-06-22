import { defineFeature, loadFeature } from 'jest-cucumber'
import { User } from '../../../users/domain/user'
import { InMemoryUserRepository } from '../../../users/repositories/userRepository/inMemoryUserRepository'
import { DatingProfile } from '../../domain/datingProfile'
import { InMemoryDatingProfileRepository } from '../../repositories/datingProfileRepository/inMemoryDatingProfileRepository'
import { GetDatingProfileOutput, GetDatingProfileUseCase } from './getDatingProfileUseCase'

const feature = loadFeature('./tests/acceptance/matches/getDatingProfile/getDatingProfile.feature')

defineFeature(feature, (test) => {
  const fakeUser = User.create({
    email: 'dzulfikar@gmail.com',
    name: 'Dzulfikar',
    password: 'asdqwe123',
  }).getValue()

  const fakeDatingProfile = DatingProfile.create({
    name: fakeUser.name,
    userId: fakeUser.userId,
  }).getValue()

  const userRepo = new InMemoryUserRepository()
  const datingProfileRepo = new InMemoryDatingProfileRepository()

  const useCase: GetDatingProfileUseCase = new GetDatingProfileUseCase(userRepo, datingProfileRepo)
  let useCaseResult: GetDatingProfileOutput

  beforeAll(async () => {
    await userRepo.save(fakeUser)
    await datingProfileRepo.save(fakeDatingProfile)
  })

  test('Successfully get dating profile', ({ given, when, then }) => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'password123',
    }).getValue()

    const userDatingProfile = DatingProfile.create({
      userId: user.userId,
      name: user.name,
    }).getValue()

    given('newly created user with dating profile', async () => {
      await userRepo.save(user)
      await datingProfileRepo.save(userDatingProfile)
    })

    when('get dating profile', async () => {
      useCaseResult = await useCase.execute({ userId: user.userId })
    })

    then('should successfully get dating profile', () => {
      expect(useCaseResult.isRight).toBeTruthy()
      if (useCaseResult.isRight()) {
        expect(useCaseResult.value.getValue().dating_profile_id).toBe(userDatingProfile.datingProfileId)
      }
    })
  })

  test('Error get dating profile due to dating profile not found', ({ given, when, then }) => {
    const newUser = User.create({
      name: 'John Cena',
      email: 'johncena@gmail.com',
      password: 'password1',
    }).getValue()
    given('seed new user without dating profile', async () => {
      await userRepo.save(newUser)
    })

    when('get dating profile with new user', async () => {
      useCaseResult = await useCase.execute({ userId: newUser.userId })
    })

    then('should return error', () => {
      expect(useCaseResult.isLeft()).toBeTruthy()
    })
  })
})
