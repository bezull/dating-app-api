import { Result } from '../../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DailyDatingProfileInteractionSchema } from '../../../../shared/infra/database/mongoose/schemas/dailyDatingProfileInteraction.schema'
import { DailyDatingProfileInteraction } from '../../domain/dailyDatingProfileInteraction'
import { DailyDatingProfileInteractionMap } from '../../mappers/dailyDatingProfileInteractionMap'
import { DailyDatingProfileInteractionRepository } from './dailyDatingProfileInteractionRepository'

export class MongooseDailyDatingProfileInteractionRepository implements DailyDatingProfileInteractionRepository {
  async save(dailyDatingProfileInteraction: DailyDatingProfileInteraction): Promise<SuccessOrFailure<void>> {
    try {
      const rawData = DailyDatingProfileInteractionMap.mapToPersistence(dailyDatingProfileInteraction)
      const mongoData = await DailyDatingProfileInteractionSchema.findOne({
        daily_dating_profile_interaction: dailyDatingProfileInteraction.dailyDatingProfileInteractionId,
      })
      if (mongoData) {
        Object.assign(mongoData, rawData)
        await mongoData.save()
      } else {
        await DailyDatingProfileInteractionSchema.create(rawData)
      }
      return Result.ok()
    } catch (error) {
      return Result.fail('Error when saving daily dating profile interaction')
    }
  }

  async saveBulk(dailyDatingProfileInteractions: DailyDatingProfileInteraction[]): Promise<SuccessOrFailure<void>> {
    return Promise.all(dailyDatingProfileInteractions.map(async (data) => this.save(data)))
      .catch(() => Result.fail())
      .then(() => Result.ok())
  }

  async getDatingProfileIdsByDailyDatingProfileId(
    dailyDatingProfileId: string,
    excludeDatingProfileId: string,
  ): Promise<string[]> {
    const mongoDatas = await DailyDatingProfileInteractionSchema.find({
      daily_dating_profile_id: dailyDatingProfileId,
      dating_profile_id: { $ne: excludeDatingProfileId },
    })

    return mongoDatas.map((data) => data.daily_dating_profile_id)
  }
}
