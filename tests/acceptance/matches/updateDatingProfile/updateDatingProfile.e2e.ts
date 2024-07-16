import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import fs from 'fs'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { appConfig } from '../../../../src/config'
import { DatingProfile } from '../../../../src/modules/matches/domain/datingProfile'
import { datingProfileRepository } from '../../../../src/modules/matches/repositories'
import { User } from '../../../../src/modules/users/domain/user'
import { authService } from '../../../../src/modules/users/services'
import { WebServer } from '../../../../src/shared/infra/http/webServer'
import { infraSetupAndTeardown, startServer } from '../../../serverTestSetupAndTeardown'

const feature = loadFeature(__dirname + '/updateDatingProfile.feature')

defineFeature(feature, (test) => {
  infraSetupAndTeardown()

  let server: WebServer = new WebServer({
    port: appConfig.appEnv.port,
  })

  let response: AxiosResponse

  const user = User.create({
    email: 'fakeemail@gmail.com',
    password: 'password1',
    name: 'fakeName',
  }).getValue()

  const accessToken: string = authService.signJWT({
    userId: user.userId,
  }).token

  const datingProfile = DatingProfile.create({
    userId: user.userId,
    name: 'fakeName',
  }).getValue()

  beforeAll(async () => {
    server = await startServer(server)
  })

  beforeEach(async () => {
    await datingProfileRepository.save(datingProfile)
  })

  afterAll(async () => {
    await server.stop()
  })

  test('successfully update dating profile name', ({ given, when, then, and }) => {
    given('dating profile with updated name', () => {
      datingProfile.updateName('NEWNAME')
    })

    when('update dating profile', async () => {
      try {
        response = await axios.patch(
          `http://localhost:${appConfig.appEnv.port}/dating-profiles`,
          {
            name: 'NEWNAME',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
      } catch (error) {
        if (error instanceof AxiosError) {
          response = error.response as AxiosResponse
        }
      }
    })

    then('should successfully update dating profile', () => {
      expect(response.status).toBe(HttpStatusCode.Ok)
    })

    and('dating profile name should match', () => {
      expect(response.data.data.name).toBe(datingProfile.name)
    })
  })

  test.only('successfully update dating profile picture', ({ given, when, then, and }) => {
    let picture: fs.ReadStream
    given('a fake picture', () => {
      picture = fs.createReadStream('src/shared/infra/objectStorageService/tests/testFiles/profile_pic.png')
    })

    when('update dating profile with fake picture', async () => {
      try {
        response = await axios.patch(
          `http://localhost:${appConfig.appEnv.port}/dating-profiles`,
          {
            profile_pic: picture,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      } catch (error) {
        if (error instanceof AxiosError) {
          response = error.response as AxiosResponse
        }
      }
    })

    then('should successfully update dating profile picture', () => {
      expect(response.status).toBe(HttpStatusCode.Ok)
    })

    and('dating profile picture url should exists', () => {
      expect(response.data.data.profile_pic_url).not.toBeUndefined()
    })
  })
})
