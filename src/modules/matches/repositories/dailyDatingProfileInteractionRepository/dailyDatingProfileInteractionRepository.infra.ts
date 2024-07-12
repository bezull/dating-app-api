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

  it('should able to get dating profile ids by daily dating profile id', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const dailyDatingProfileId = uuidv4()
        const excludeDatingProfileId = uuidv4()

        const dailyDatingProfileInteraction: DailyDatingProfileInteraction[] = [
          DailyDatingProfileInteraction.create({
            dailyDatingProfileId,
            datingProfileId: uuidv4(),
            isLiked: false,
          }).getValue(),
          DailyDatingProfileInteraction.create({
            dailyDatingProfileId,
            datingProfileId: excludeDatingProfileId,
            isLiked: false,
          }).getValue(),
        ]

        await repo.saveBulk(dailyDatingProfileInteraction)

        const datingProfileIds = await repo.getDatingProfileIdsByDailyDatingProfileId(
          dailyDatingProfileId,
          excludeDatingProfileId,
        )

        expect(datingProfileIds.length).toBe(1)
      }),
    )
  })

  it('should able to check if dating profile is interacted', async () => {
    await Promise.all(
      repositories.map(async (repo) => {
        const dailyDatingProfileId = uuidv4()
        const datingProfileId = uuidv4()
        const dailyDatingProfileInteraction: DailyDatingProfileInteraction = DailyDatingProfileInteraction.create({
          dailyDatingProfileId,
          datingProfileId,
          isLiked: false,
        }).getValue()

        await repo.save(dailyDatingProfileInteraction)
        const isDatingProfileInteracted = await repo.isDatingProfileInteracted(dailyDatingProfileId, datingProfileId)
        expect(isDatingProfileInteracted).toBeTruthy()
      }),
    )
  })
})
