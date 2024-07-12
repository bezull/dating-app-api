import axios, { AxiosError, AxiosResponse } from 'axios'
import { defineFeature, loadFeature } from 'jest-cucumber'
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

const feature = loadFeature(__dirname + '/swipeRightDatingProfile.feature')

defineFeature(feature, (test) => {
  infraSetupAndTeardown()

  let server: WebServer = new WebServer({
    port: appConfig.appEnv.port,
  })

  let response: AxiosResponse

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
    email: 'fakeuser2@gmail.com',
    password: 'password1',
  }).getValue()

  const fakeUserTwoDatingProfile = DatingProfile.create({
    name: 'Fake Two',
    userId: fakeUserOne.userId,
  }).getValue()

  beforeAll(async () => {
    server = await startServer(server)
  })

  afterAll(async () => {
    server.stop()
  })

  test('successfully swipe right dating profile', ({ given, when, then, and }) => {
    given('seed new user and dating profile', async () => {
      await userRepository.saveBulk([fakeUserOne, fakeUserTwo])
      await datingProfileRepository.saveBulk([fakeUserOneDatingProfile, fakeUserTwoDatingProfile])
    })

    when('swipe right dating profile', async () => {
      try {
        response = await axios.post(
          `http://localhost:${appConfig.appEnv.port}/matches/like-dating-profile/${fakeUserTwoDatingProfile.datingProfileId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                authService.signJWT({
                  userId: fakeUserOne.userId,
                }).token
              }`,
            },
          },
        )
      } catch (error) {
        if (error instanceof AxiosError) {
          response = error.response as AxiosResponse
        }
      }
    })

    then('should successfully swipe right dating profile', () => {
      expect(response.status).toBe(200)
      expect(response.data.data).toBe('Successfully swipe right dating profile')
    })

    and(/^dating profile total like increased by (.*)$/, async (increment: number) => {
      const datingProfile = await datingProfileRepository.getDatingProfileByFilter({
        datingProfileId: fakeUserTwoDatingProfile.datingProfileId,
      })
      expect(datingProfile.getValue().totalLikes).toBe(Number(increment))
    })
  })
  test('error swipe right dating profile due to already interacted today', ({ given, when, then }) => {
    given('seed new user, dating profile, daily dating profile, and daily dating profile interaction', async () => {
      await userRepository.saveBulk([fakeUserOne, fakeUserTwo])
      await datingProfileRepository.saveBulk([fakeUserOneDatingProfile, fakeUserTwoDatingProfile])

      const dailyDatingProfile = DailyDatingProfile.create({
        userId: fakeUserOne.userId,
      }).getValue()
      const dailyDatingProfileInteraction = DailyDatingProfileInteraction.create({
        dailyDatingProfileId: dailyDatingProfile.dailyDatingProfileId,
        datingProfileId: fakeUserTwoDatingProfile.datingProfileId,
        isLiked: false,
      }).getValue()

      await dailyDatingProfileRepository.save(dailyDatingProfile)
      await dailyDatingProfileInteractionRepository.save(dailyDatingProfileInteraction)
    })

    when('swipe right dating profile', async () => {
      try {
        response = await axios.post(
          `http://localhost:${appConfig.appEnv.port}/matches/like-dating-profile/${fakeUserTwoDatingProfile.datingProfileId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                authService.signJWT({
                  userId: fakeUserOne.userId,
                }).token
              }`,
            },
          },
        )
      } catch (error) {
        if (error instanceof AxiosError) {
          response = error.response as AxiosResponse
        }
      }
    })

    then('should return error swipe right dating profile due to already interacted today', () => {
      expect(response.status).toBe(400)
      expect(response.data.data.message).toBe('Dating profile already interacted today')
    })
  })
})
