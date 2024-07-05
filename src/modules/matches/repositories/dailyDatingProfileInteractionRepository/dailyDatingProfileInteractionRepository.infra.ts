import { v4 as uuidv4 } from 'uuid'
import { infraSetupAndTeardown } from '../../../../../tests/serverTestSetupAndTeardown'
import { DailyDatingProfileInteraction } from '../../domain/dailyDatingProfileInteraction'
import { DailyDatingProfileInteractionRepository } from './dailyDatingProfileInteractionRepository'
import { InMemoryDailyDatingProfileInteractionRepository } from './inMemoryDailyDatingProfileInteractionRepository'
import { MongooseDailyDatingProfileInteractionRepository } from './mongooseDailyDatingProfileInteractionRepository'

infraSetupAndTeardown()

const repositories: DailyDatingProfileInteractionRepository[] = [
  new InMemoryDailyDatingProfileInteractionRepository(),
  new MongooseDailyDatingProfileInteractionRepository(),
]

describe('DailyDatingProfileInteractionRepository', () => {
  it('should able to save daily dating profile interaction', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const dailyDatingProfileInteraction = DailyDatingProfileInteraction.create({
          dailyDatingProfileId: uuidv4(),
          datingProfileId: uuidv4(),
          isLiked: false,
        }).getValue()

        const saveResult = await repo.save(dailyDatingProfileInteraction)

        expect(saveResult.isSuccess).toBeTruthy()
      }),
    )
  })
})
