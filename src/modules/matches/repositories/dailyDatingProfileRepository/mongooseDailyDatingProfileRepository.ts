import { Result } from '../../../../shared/core/result/result'
import { Maybe } from '../../../../shared/core/result/searchResult'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DailyDatingProfileSchema } from '../../../../shared/infra/database/mongoose/schemas/dailyDatingProfile.schema'
import { Logger } from '../../../../shared/infra/logger'
import { DateUtil } from '../../../../shared/utils/dateUtil'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'
import { DailyDatingProfileMap } from '../../mappers/dailyDatingProfileMap'
import { DailyDatingProfileRepository } from './dailyDatingProfileRepository'

export class MongooseDailyDatingProfileRepository implements DailyDatingProfileRepository {
  async save(dailyDatingProfile: DailyDatingProfile): Promise<SuccessOrFailure<void>> {
    try {
      const rawDailyDatingProfile = DailyDatingProfileMap.mapToPersistence(dailyDatingProfile)

      const mongoDailyDatingProfile = await DailyDatingProfileSchema.findOne({
        user_id: rawDailyDatingProfile.user_id,
        date: DateUtil.getTodayFormatted(),
      })

      if (mongoDailyDatingProfile) {
        Object.assign(mongoDailyDatingProfile, rawDailyDatingProfile)
        mongoDailyDatingProfile.save()
      } else {
        await DailyDatingProfileSchema.create(rawDailyDatingProfile)
      }
      return Result.ok()
    } catch (error) {
      Logger.error('Error when saving daily dating profile', error)
      return Result.fail('Error when saving daily dating profile')
    }
  }

  async saveBulk(dailyDatingProfile: DailyDatingProfile[]): Promise<SuccessOrFailure<void>> {
    try {
      await Promise.all(dailyDatingProfile.map(async (dailyDatingProfile) => await this.save(dailyDatingProfile)))
      return Result.ok()
    } catch (err) {
      return Result.fail('Error when saving daily dating profile bulk')
    }
  }

  async getTodayDailyDatingProfileByUserId(userId: string): Promise<Maybe<DailyDatingProfile>> {
    const mongooseDailyDatingProfile = await DailyDatingProfileSchema.findOne({
      user_id: userId,
      date: DateUtil.getTodayFormatted(),
    })

    if (mongooseDailyDatingProfile) {
      return Result.found(DailyDatingProfileMap.mapToDomain(mongooseDailyDatingProfile))
    } else {
      return Result.notFound('Daily dating profile not found')
    }
  }
}
