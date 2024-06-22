import { defineFeature, loadFeature } from 'jest-cucumber'
import { v4 as uuidv4 } from 'uuid'
import { DatingProfile } from '../../domain/datingProfile'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { InMemoryDatingProfileRepository } from '../../repositories/datingProfileRepository/inMemoryDatingProfileRepository'
import { CreateDatingProfileOutput, CreateDatingProfileUseCase } from './createDatingProfileUseCase'

const feature = loadFeature('./tests/acceptance/matches/createDatingProfile/createDatingProfile.feature')

defineFeature(feature, (test) => {
  const fakeRepo: DatingProfileRepository = new InMemoryDatingProfileRepository()
  const useCase = new CreateDatingProfileUseCase(fakeRepo)

  let useCaseResult: CreateDatingProfileOutput

  test('Successfully create dating profile', ({ given, when, then }) => {
    let userId: string
    let name: string

    given('valid user id and name', () => {
      userId = uuidv4()
      name = 'Dzulfikar'
    })

    when('create dating profile with valid user id and name', async () => {
      useCaseResult = await useCase.execute({
        userId,
        name,
      })
    })

    then('should successfully create dating profile', () => {
      expect(useCaseResult.isRight).toBeTruthy()
    })
  })
  test('Error create dating profile', ({ given, when, then }) => {
    const fakeDatingProfile = DatingProfile.create({
      userId: uuidv4(),
      name: 'Dzulfikar',
    }).getValue()
    given('seed 1 dating profile', async () => {
      await fakeRepo.save(fakeDatingProfile)
    })

    when('create dating profile using user id and name from seeded dating profile', async () => {
      useCaseResult = await useCase.execute({
        name: fakeDatingProfile.name,
        userId: fakeDatingProfile.userId,
      })
    })

    then(/^should return error with message "(.*)"$/, (errMsg) => {
      expect(useCaseResult.isLeft()).toBeTruthy()
      if (useCaseResult.isLeft()) {
        expect(useCaseResult.error.getErrorValue()).toBe(errMsg)
      }
    })
  })
})
