import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { appConfig } from '../../../../src/config'
import { User } from '../../../../src/modules/users/domain/user'
import { userRepository } from '../../../../src/modules/users/repositories'
import { SignInInputDTO } from '../../../../src/modules/users/useCases/signIn/signInDTO'
import { WebServer } from '../../../../src/shared/infra/http/webServer'
import { infraSetupAndTeardown, startServer } from '../../../serverTestSetupAndTeardown'

const feature = loadFeature(__dirname + '/signin.feature')

defineFeature(feature, (test) => {
  infraSetupAndTeardown()

  let server: WebServer = new WebServer({
    port: appConfig.appEnv.port,
  })
  let response: AxiosResponse

  let signInDto: SignInInputDTO

  const fakeUser = User.create({
    email: 'fakeuser@gmail.com',
    name: 'fakeUser',
    password: 'password123',
  }).getValue()

  beforeAll(async () => {
    server = await startServer(server)
  })

  beforeEach(async () => {
    await fakeUser.hashPassword()

    await userRepository.save(fakeUser)
  })

  afterAll(async () => {
    server.stop()
  })

  test('Successfully sign in user', ({ given, when, then }) => {
    given('valid email and password', () => {
      signInDto = {
        email: 'fakeuser@gmail.com',
        password: 'password123',
      }
    })

    when('Sign in', async () => {
      try {
        response = await axios.post(`http://localhost:${appConfig.appEnv.port}/auth/sign-in`, signInDto, {})
      } catch (err) {
        if (err instanceof AxiosError) {
          response = err.response as AxiosResponse
        }
      }
    })

    then('Should successfully sign in user', () => {
      expect(response.status).toBe(HttpStatusCode.Ok)
      expect(response.data.data.user.email).toBe(signInDto.email)
      expect(response.data.data.token.access_token).toBeDefined()
    })
  })

  test('Error sign in due to email not found', ({ given, when, then }) => {
    given('invalid email and password', () => {
      signInDto = {
        email: 'invalidemail@gmail.com',
        password: 'password123',
      }
    })

    when('Sign In', async () => {
      try {
        response = await axios.post(`http://localhost:${appConfig.appEnv.port}/auth/sign-in`, signInDto, {})
      } catch (err) {
        if (err instanceof AxiosError) {
          response = err.response as AxiosResponse
        }
      }
    })

    then(/^should return error with message "(.*)"$/, (errMsg) => {
      expect(response.status).toBe(HttpStatusCode.BadRequest)
      expect(response.data.data.message).toBe(errMsg)
    })
  })
  test('Error sign in due to invalid credential', ({ given, when, then }) => {
    given('valid email and invalid password', () => {
      signInDto = {
        email: fakeUser.email,
        password: fakeUser.password,
      }
    })

    when('Sign In', async () => {
      try {
        response = await axios.post(`http://localhost:${appConfig.appEnv.port}/auth/sign-in`, signInDto, {})
      } catch (err) {
        if (err instanceof AxiosError) {
          response = err.response as AxiosResponse
        }
      }
    })

    then(/^should return error with message "(.*)"$/, (errMsg) => {
      expect(response.status).toBe(HttpStatusCode.BadRequest)
      expect(response.data.data.message).toBe(errMsg)
    })
  })
})
