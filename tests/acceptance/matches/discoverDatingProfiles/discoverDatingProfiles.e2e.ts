import axios, { AxiosError, AxiosResponse } from 'axios'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { v4 as uuidv4 } from 'uuid'
import { appConfig } from '../../../../src/config'
import { DailyDatingProfile } from '../../../../src/modules/matches/domain/dailyDatingProfile'
import { DailyDatingProfileInteraction } from '../../../../src/modules/matches/domain/dailyDatingProfileInteraction'
import { DatingProfile } from '../../../../src/modules/matches/domain/datingProfile'
import {
  dailyDatingProfileInteractionRepository,
  dailyDatingProfileRepository,
  datingProfileRepository,
} from '../../../../src/modules/matches/repositories'
import { User } from '../../../../src/modules/users/domain/user'
import { userRepository } from '../../../../src/modules/users/repositories'
import { authService } from '../../../../src/modules/users/services'
import { WebServer } from '../../../../src/shared/infra/http/webServer'
import { infraSetupAndTeardown, startServer } from '../../../serverTestSetupAndTeardown'

const feature = loadFeature(__dirname + '/discoverDatingProfiles.feature')

defineFeature(feature, (test) => {
  infraSetupAndTeardown()

  let server: WebServer = new WebServer({
    port: appConfig.appEnv.port,
  })

  let response: AxiosResponse

  const fakeUser = User.create({
    email: 'fakeuser@gmail.com',
    name: 'fakeUser',
    password: 'password123',
  }).getValue()

  const fakeDatingProfile = DatingProfile.create({
    name: 'fakeUser',
    userId: fakeUser.userId,
  }).getValue()

  const datingProfiles: DatingProfile[] = []

  beforeAll(async () => {
    server = await startServer(server)
  })

  beforeEach(async () => {
    await userRepository.save(fakeUser)
    await datingProfileRepository.save(fakeDatingProfile)
  })

  afterAll(async () => {
    server.stop()
  })

  test('successfully discover dating profiles', ({ given, when, then }) => {
    const userId: string = uuidv4()
    const accessToken: string = authService.signJWT({
      userId,
    }).token

    given('seed new user and dating profile', async () => {
      const user = User.create(
        {
          email: 'dzulfikar@gmail.com',
          name: 'dzulfikar',
          password: 'password123',
        },
        userId,
      ).getValue()

      const datingProfile = DatingProfile.create({
        name: 'dzulfikar',
        userId: user.userId,
      }).getValue()

      await userRepository.save(user)
      await datingProfileRepository.save(datingProfile)
    })

    when('discover dating profiles using newly seeded user id', async () => {
      try {
        response = await axios.get(`http://localhost:${appConfig.appEnv.port}/matches/discover-dating-profiles`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          response = error.response as AxiosResponse
        }
      }
    })

    then('should return dating profiles', () => {
      expect(response.status).toBe(200)
      expect(response.data.data.datingProfiles.length).toBe(1)
      expect(response.data.data.datingProfiles[0].name).toBe('fakeUser')
    })
  })
  test("successfully discover dating profiles that haven't been interacted", ({ given, when, then }) => {
    const userId: string = uuidv4()
    const accessToken: string = authService.signJWT({
      userId,
    }).token

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

      await userRepository.save(newUser)
      await datingProfileRepository.save(newDatingProfile)
      await dailyDatingProfileRepository.save(newDailyDatingProfile)
      await dailyDatingProfileInteractionRepository.saveBulk(newDailyDatingProfileInteractions)
    })

    when('discover dating profiles using newly seeded user id', async () => {
      try {
        response = await axios.get(`http://localhost:${appConfig.appEnv.port}/matches/discover-dating-profiles`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          response = error.response as AxiosResponse
        }
      }
    })

    then("should return dating profiles that hasn't been interacted", () => {
      expect(response.status).toBe(200)
      expect(response.data.data.datingProfiles.length).toBe(1)
      expect(response.data.data.datingProfiles[0].name).toBe('fakeUser')
    })
  })
})
