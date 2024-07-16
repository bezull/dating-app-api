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

  it('should able to update dating profile name', () => {
    const datingProfile = DatingProfile.create({
      userId: uuidv4(),
      name: 'Dzulfikar',
    }).getValue()
    datingProfile.updateName('Dzulfikar')
    expect(datingProfile.name).toBe('Dzulfikar')
  })

  it('should able to update dating profile profile pic', () => {
    const datingProfile = DatingProfile.create({
      userId: uuidv4(),
      name: 'Dzulfikar',
      profilePicUrl: '',
    }).getValue()
    datingProfile.updateProfilePicUrl('https://picsum.photos/200')
    expect(datingProfile.profilePicUrl).toBe('https://picsum.photos/200')
  })
})
