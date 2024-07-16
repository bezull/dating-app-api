import fs from 'fs'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { UploadObject } from '../../../../shared/infra/objectStorageService/domain/uploadObject'
import { LocalObjectStorageService } from '../../../../shared/infra/objectStorageService/localObjectStorageService'
import { ObjectStorageService } from '../../../../shared/infra/objectStorageService/objectStorageService'
import { User } from '../../../users/domain/user'
import { DatingProfile } from '../../domain/datingProfile'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { InMemoryDatingProfileRepository } from '../../repositories/datingProfileRepository/inMemoryDatingProfileRepository'
import { UpdateDatingProfileUseCase, UpdateDatingProfileUseCaseOutput } from './updateDatingProfileUseCase'

const feature = loadFeature('./tests/acceptance/matches/updateDatingProfile/updateDatingProfile.feature')

defineFeature(feature, (test) => {
  const datingProfileRepo: DatingProfileRepository = new InMemoryDatingProfileRepository()
  const localObjectStorageService: ObjectStorageService = new LocalObjectStorageService()

  const useCase: UpdateDatingProfileUseCase = new UpdateDatingProfileUseCase(
    datingProfileRepo,
    localObjectStorageService,
  )

  let useCaseOutput: UpdateDatingProfileUseCaseOutput

  const user = User.create({
    email: 'fakeemail@gmail.com',
    password: 'password1',
    name: 'fakeName',
  }).getValue()

  const datingProfile = DatingProfile.create({
    userId: user.userId,
    name: 'fakeName',
  }).getValue()

  beforeAll(async () => {
    await datingProfileRepo.save(datingProfile)
  })

  test('successfully update dating profile name', ({ given, when, then, and }) => {
    given('dating profile with updated name', () => {
      datingProfile.updateName('NEWNAME')
    })

    when('update dating profile', async () => {
      useCaseOutput = await useCase.execute({
        userId: user.userId,
        name: datingProfile.name,
      })
    })

    then('should successfully update dating profile', () => {
      expect(useCaseOutput.isRight()).toBeTruthy()
    })

    and('dating profile name should match', () => {
      if (useCaseOutput.isRight()) {
        expect(useCaseOutput.value.name).toBe(datingProfile.name)
      }
    })
  })

  test('successfully update dating profile picture', ({ given, when, then, and }) => {
    let picture: UploadObject | undefined
    given('a fake picture', () => {
      const pictureBuffer = fs.readFileSync('src/shared/infra/objectStorageService/tests/testFiles/profile_pic.png')
      picture = {
        type: 'media',
        buffer: pictureBuffer,
        extension: 'png',
      }
    })

    when('update dating profile with fake picture', async () => {
      useCaseOutput = await useCase.execute({
        userId: user.userId,
        profilePic: picture,
      })
    })

    then('should successfully update dating profile picture', () => {
      expect(useCaseOutput.isRight()).toBeTruthy()
    })

    and('dating profile picture url should exists', () => {
      if (useCaseOutput.isRight()) {
        expect(useCaseOutput.value.profile_pic_url).not.toBeUndefined()
      }
    })
  })
})
