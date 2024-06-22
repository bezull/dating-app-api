import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { v4 as uuidv4 } from 'uuid'
import { appConfig } from '../../../../src/config'
import { DatingProfile } from '../../../../src/modules/matches/domain/datingProfile'
import { datingProfileRepository } from '../../../../src/modules/matches/repositories'
import { User } from '../../../../src/modules/users/domain/user'
import { userRepository } from '../../../../src/modules/users/repositories'
import { authService } from '../../../../src/modules/users/services'
import { WebServer } from '../../../../src/shared/infra/http/webServer'
import { infraSetupAndTeardown, startServer } from '../../../serverTestSetupAndTeardown'

const feature = loadFeature(__dirname + '/getDatingProfile.feature')

defineFeature(feature, (test) => {
  infraSetupAndTeardown()

  let server: WebServer = new WebServer({
    port: appConfig.appEnv.port,
  })

  let response: AxiosResponse

  const fakeUser = User.create({
    email: 'dzulfikar@gmail.com',
    name: 'Dzulfikar',
    password: 'password1',
  }).getValue()

  const fakeDatingProfile = DatingProfile.create({
    name: fakeUser.name,
    userId: fakeUser.userId,
  }).getValue()

  beforeAll(async () => {
    server = await startServer(server)
  })

  beforeEach(async () => {
    await userRepository.save(fakeUser)
    await datingProfileRepository.save(fakeDatingProfile)
  })

  afterAll(async () => {
    await server.stop()
  })

  test('Successfully get dating profile', ({ given, when, then }) => {
    const userId: string = uuidv4()
    const accessToken: string = authService.signJWT({
      userId: userId,
    }).token

    const newUser = User.create(
      {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'pass123',
      },
      userId,
    ).getValue()

    const userDatingProfile = DatingProfile.create({
      userId: newUser.userId,
      name: newUser.name,
    }).getValue()

    given('newly created user with dating profile', async () => {
      await userRepository.save(newUser)
      await datingProfileRepository.save(userDatingProfile)
    })

    when('get dating profile', async () => {
      try {
        response = await axios.get(`http://localhost:${appConfig.appEnv.port}/dating-profiles`, {
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

    then('should successfully get dating profile', () => {
      expect(response.status).toBe(HttpStatusCode.Ok)
      expect(response.data.data.dating_profile_id).toBe(userDatingProfile.datingProfileId)
    })
  })

  test('Error get dating profile due to dating profile not found', ({ given, when, then }) => {
    const userId: string = uuidv4()
    const accessToken: string = authService.signJWT({ userId }).token

    given('seed new user without dating profile', async () => {
      const newUser = User.create(
        {
          name: 'John',
          email: 'john@gmail.com',
          password: 'pass123',
        },
        userId,
      ).getValue()

      await userRepository.save(newUser)
    })

    when('get dating profile with new user', async () => {
      try {
        response = await axios.get(`http://localhost:${appConfig.appEnv.port}/dating-profiles`, {
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

    then('should return error', () => {
      expect(response.status).toBe(HttpStatusCode.InternalServerError)
    })
  })
})
