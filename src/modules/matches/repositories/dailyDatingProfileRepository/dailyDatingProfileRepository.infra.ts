import { v4 as uuidv4 } from 'uuid'
import { infraSetupAndTeardown } from '../../../../../tests/serverTestSetupAndTeardown'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'
import { DailyDatingProfileRepository } from './dailyDatingProfileRepository'
import { InMemoryDailyDatingProfileRepository } from './inMemoryDailyDatingProfileRepository'
import { MongooseDailyDatingProfileRepository } from './mongooseDailyDatingProfileRepository'

infraSetupAndTeardown()

const repositories: DailyDatingProfileRepository[] = [
  new InMemoryDailyDatingProfileRepository(),
  new MongooseDailyDatingProfileRepository(),
]

describe('DailyDatingProfileRepository', () => {
  it('should able to save daily dating profile', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const dailyDatingProfile = DailyDatingProfile.create({
          userId: uuidv4(),
        }).getValue()
        const saveResult = await repo.save(dailyDatingProfile)
        expect(saveResult.isSuccess).toBeTruthy()
      }),
    )
  })

  it('should able to get today daily dating profile by user id', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const userIdOne = uuidv4()

        await repo.saveBulk([
          DailyDatingProfile.create({
            userId: userIdOne,
          }).getValue(),
          DailyDatingProfile.create({
            userId: uuidv4(),
          }).getValue(),
        ])

        const getTodayDailyDatingProfile = await repo.getTodayDailyDatingProfileByUserId(userIdOne)
        expect(getTodayDailyDatingProfile.isFound).toBeTruthy()
      }),
    )
  })
})
