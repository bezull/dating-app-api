import { infraSetupAndTeardown } from '../../../../tests/serverTestSetupAndTeardown'
import { User } from '../../domain/user'
import { InMemoryUserRepository } from './inMemoryUserRepository'
import { SequelizeUserRepository } from './sequelizeUserRepository'
import { UserRepository } from './userRepository'

infraSetupAndTeardown()

const repositories: UserRepository[] = [new InMemoryUserRepository(), new SequelizeUserRepository()]

describe('UserRepository', () => {
  it('should able to save users', async () => {
    const fakeUser = User.create({
      name: 'dzulfikar',
      email: 'dzulfikar@gmail.com',
      password: 'test123',
    }).getValue()

    await Promise.all(
      repositories.map(async (repo) => {
        const saveResult = await repo.save(fakeUser)
        expect(saveResult.isSuccess).toBeTruthy()
      }),
    )
  })

  it('should able to check is email already in use', async () => {
    const fakeUser = User.create({
      name: 'dzulfikar',
      email: 'dzulfikar@gmail.com',
      password: 'test123',
    }).getValue()

    await Promise.all(
      repositories.map(async (repo) => {
        await repo.save(fakeUser)
        const isEmailExist = await repo.isEmailAlreadyInUse(fakeUser.email)
        expect(isEmailExist).toBeTruthy()
      }),
    )
  })

  it('should able to get user by email', async () => {
    const fakeUser = User.create({
      name: 'dzulfikar',
      email: 'dzulfikar@gmail.com',
      password: 'test123',
    }).getValue()

    await Promise.all(
      repositories.map(async (repo) => {
        await repo.save(fakeUser)
        const user = await repo.getUserByEmail(fakeUser.email)
        expect(user.isFound).toBeTruthy()
        expect(user.getValue().email).toBe(fakeUser.email)
      }),
    )
  })
})
