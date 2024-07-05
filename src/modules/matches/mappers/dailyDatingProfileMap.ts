import { DailyDatingProfileAttributes } from '../../../shared/infra/database/mongoose/schemas/dailyDatingProfile.schema'
import { DailyDatingProfile } from '../domain/dailyDatingProfile'

export class DailyDatingProfileMap {
  static mapToDomain(raw: DailyDatingProfileAttributes): DailyDatingProfile {
    return DailyDatingProfile.create(
      {
        userId: raw.user_id,
        date: raw.date,
        totalInteractions: raw.total_interactions,
      },
      raw.daily_dating_profile_id,
    ).getValue()
  }

  static mapToPersistence(dailyDatingProfile: DailyDatingProfile): DailyDatingProfileAttributes {
    return {
      daily_dating_profile_id: dailyDatingProfile.dailyDatingProfileId,
      date: dailyDatingProfile.date,
      total_interactions: dailyDatingProfile.totalInteractions,
      user_id: dailyDatingProfile.userId,
    }
  }
}
