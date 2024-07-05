import { Maybe } from '../../../../shared/core/result/searchResult'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DailyDatingProfile } from '../../domain/dailyDatingProfile'

export interface DailyDatingProfileRepository {
  save: (dailyDatingProfile: DailyDatingProfile) => Promise<SuccessOrFailure<void>>
  saveBulk: (datingDatingProfiles: DailyDatingProfile[]) => Promise<SuccessOrFailure<void>>
  getTodayDailyDatingProfileByUserId: (userId: string) => Promise<Maybe<DailyDatingProfile>>
}
