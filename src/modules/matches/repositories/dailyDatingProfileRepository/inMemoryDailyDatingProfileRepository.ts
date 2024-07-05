import { Result } from '../../../../shared/core/result/result'
import { Maybe } from '../../../../shared/core/result/searchResult'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DateUtil } from '../../../../shared/utils/dateUtil'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'
import { DailyDatingProfileRepository } from './dailyDatingProfileRepository'

export class InMemoryDailyDatingProfileRepository implements DailyDatingProfileRepository {
  #inMemoryDailyDatingProfiles: DailyDatingProfile[] = []

  async save(dailyDatingProfile: DailyDatingProfile): Promise<SuccessOrFailure<void>> {
    const existingIndex = this.#inMemoryDailyDatingProfiles.findIndex(
      (iData) => iData.dailyDatingProfileId === dailyDatingProfile.dailyDatingProfileId,
    )

    if (existingIndex != -1) {
      this.#inMemoryDailyDatingProfiles[existingIndex] = dailyDatingProfile
    } else {
      this.#inMemoryDailyDatingProfiles.push(dailyDatingProfile)
    }
    return Result.ok()
  }

  async saveBulk(datingDatingProfiles: DailyDatingProfile[]): Promise<SuccessOrFailure<void>> {
    return Promise.all(datingDatingProfiles.map(async (dailyDatingProfile) => this.save(dailyDatingProfile)))
      .catch((err) => Result.fail(err))
      .then(() => Result.ok())
  }

  async getTodayDailyDatingProfileByUserId(userId: string): Promise<Maybe<DailyDatingProfile>> {
    const existingData = this.#inMemoryDailyDatingProfiles.find(
      (data) => data.userId === userId && data.date === DateUtil.getTodayFormatted(),
    )

    return existingData ? Result.found(existingData) : Result.notFound('Today daily dating profile not found')
  }
}
