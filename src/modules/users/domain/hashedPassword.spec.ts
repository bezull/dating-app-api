import { HashedPassword } from './hashedPassword'

describe('HashedPassword', () => {
  it('should able to hash a password', async () => {
    const hashedPassword = await HashedPassword.hash('password')
    expect(hashedPassword.isSuccess).toBeTruthy
  })

  it('should able to compare a password', async () => {
    const hashedPassword = await HashedPassword.hash('password')
    const isValid = await HashedPassword.compare('password', hashedPassword.getValue().value)
    expect(isValid).toBeTruthy
  })
})
