import { v4 as uuidv4 } from 'uuid'
import { DatingProfile } from './datingProfile'

describe(DatingProfile.name, () => {
  it('should able to create dating profile', () => {
    const datingProfileResult = DatingProfile.create({
      userId: uuidv4(),
      name: 'Dzulfikar',
    })

    expect(datingProfileResult.isSuccess).toBeTruthy()
  })
})
