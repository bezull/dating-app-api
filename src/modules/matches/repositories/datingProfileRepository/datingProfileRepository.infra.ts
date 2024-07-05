import { v4 as uuidv4 } from 'uuid'
import { infraSetupAndTeardown } from '../../../../../tests/serverTestSetupAndTeardown'
import { DatingProfile } from '../../domain/datingProfile'
import { DatingProfileRepository } from './datingProfileRepository'
import { InMemoryDatingProfileRepository } from './inMemoryDatingProfileRepository'
import { MongooseDatingProfileRepository } from './mongooseDatingProfileRepository'

infraSetupAndTeardown()

const repositories: DatingProfileRepository[] = [
  new InMemoryDatingProfileRepository(),
  new MongooseDatingProfileRepository(),
]

const fakeDatingProfile = DatingProfile.create({
  userId: uuidv4(),
  name: 'Dzulfikar',
}).getValue()

describe('DatingProfileRepository', () => {
  it('should able to save dating profile', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const saveResult = await repo.save(fakeDatingProfile)
        expect(saveResult.isSuccess).toBeTruthy()
      }),
    )
  })

  it('should able to get dating profile by user id', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        await repo.save(fakeDatingProfile)
        const findDatingProfile = await repo.getDatingProfileByUserId(fakeDatingProfile.userId)
        expect(findDatingProfile.isFound).toBeTruthy()
      }),
    )
  })

  it('should able to get uninteracted dating profiles', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const datingProfiles = []
        for (let index = 0; index < 10; index++) {
          datingProfiles.push(
            DatingProfile.create({
              userId: uuidv4(),
              name: 'John' + index,
            }).getValue(),
          )
        }

        await repo.saveBulk([fakeDatingProfile, ...datingProfiles])

        const uninteractedDatingProfiles = await repo.getUninteractedDatingProfiles(
          [fakeDatingProfile.datingProfileId],
          fakeDatingProfile.datingProfileId,
        )
        expect(uninteractedDatingProfiles.length).toBe(10)
      }),
    )
  })
})
