import { User } from './user'

describe('User', () => {
  it('should able to create user ', () => {
    const user = User.create({
      email: 'dzulfikar@gmail.com',
      name: 'Dzulfikar',
      password: 'password123',
    })

    expect(user.isSuccess).toBeTruthy()
  })
})
