import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { appConfig } from '../../../../config'
import { User } from '../../../../modules/users/domain/user'
import { userRepository } from '../../../../modules/users/repositories'
import { SignUpUseCaseInputDTO } from '../../../../modules/users/useCases/signUp/signUpDTO'
import { WebServer } from '../../../../shared/infra/http/webServer'
import { infraSetupAndTeardown, startServer } from '../../../serverTestSetupAndTeardown'

const feature = loadFeature(__dirname + '/signUp.feature')

defineFeature(feature, (test) => {
  infraSetupAndTeardown()

  let server: WebServer = new WebServer({
    port: appConfig.appEnv.port,
  })
  let response: AxiosResponse

  let signUpDto: SignUpUseCaseInputDTO

  const fakeUser = User.create({
    email: 'fakeuser@gmail.com',
    name: 'fakeUser',
    password: 'password123',
  }).getValue()

  beforeAll(async () => {
    server = await startServer(server)
  })

  beforeEach(async () => {
    await userRepository.save(fakeUser)
  })

  afterAll(async () => {
    server.stop()
  })

  test('Successfully sign up user', ({ given, when, then }) => {
    given('email, name, and password', () => {
      signUpDto = {
        email: 'dzulfikar@gmail.com',
        name: 'dzulfikar',
        password: 'password123',
      }
    })

    when('Sign up', async () => {
      try {
        response = await axios.post(`http://localhost:${appConfig.appEnv.port}/auth/sign-up`, signUpDto, {})
      } catch (err) {
        if (err instanceof AxiosError) {
          response = err.response as AxiosResponse
        }
      }
    })

    then('Should successfully sign up user', () => {
      expect(response.status).toBe(HttpStatusCode.Ok)
      expect(response.data.data.email).toBe(signUpDto.email)
    })
  })
  test('Error sign up user', ({ given, when, then }) => {
    given('duplicate email, name, and password', async () => {
      signUpDto = {
        email: 'fakeuser@gmail.com',
        name: 'dzulfikar',
        password: 'password123',
      }
    })

    when('Sign Up', async () => {
      try {
        response = await axios.post(`http://localhost:${appConfig.appEnv.port}/auth/sign-up`, signUpDto, {})
      } catch (err) {
        if (err instanceof AxiosError) {
          response = err.response as AxiosResponse
        }
      }
    })

    then(/^should return error with message "(.*)"$/, (msg) => {
      expect(response.status).toBe(HttpStatusCode.BadRequest)
      expect(response.data.data.message).toBe(msg)
    })
  })
})
