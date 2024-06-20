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
})
