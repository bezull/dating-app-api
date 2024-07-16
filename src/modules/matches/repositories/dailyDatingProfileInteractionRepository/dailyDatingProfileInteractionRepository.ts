import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DailyDatingProfileInteraction } from '../../domain/dailyDatingProfileInteraction'

export interface DailyDatingProfileInteractionRepository {
  save: (dailyDatingProfileInteraction: DailyDatingProfileInteraction) => Promise<SuccessOrFailure<void>>
  saveBulk: (dailyDatingProfileInteractions: DailyDatingProfileInteraction[]) => Promise<SuccessOrFailure<void>>
  getDatingProfileIdsByDailyDatingProfileId: (
    dailyDatingProfileId: string,
    excludeDatingProfileId: string,
  ) => Promise<string[]>
  isDatingProfileInteracted: (dailyDatingProfileId: string, datingProfileId: string) => Promise<boolean>
  delete: () => Promise<SuccessOrFailure<void>>
}
