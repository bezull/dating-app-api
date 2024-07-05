import { DailyDatingProfileInteractionAttributes } from '../../../shared/infra/database/mongoose/schemas/dailyDatingProfileInteraction.schema'
import { DailyDatingProfileInteraction } from '../domain/dailyDatingProfileInteraction'

export class DailyDatingProfileInteractionMap {
  static mapToDomain(raw: DailyDatingProfileInteractionAttributes): DailyDatingProfileInteraction {
    return DailyDatingProfileInteraction.create(
      {
        dailyDatingProfileId: raw.daily_dating_profile_id,
        datingProfileId: raw.dating_profile_id,
        isLiked: raw.is_liked,
      },
      raw.daily_dating_profile_interaction_id,
    ).getValue()
  }

  static mapToPersistence(
    dailyDatingProfileInteraction: DailyDatingProfileInteraction,
  ): DailyDatingProfileInteractionAttributes {
    return {
      daily_dating_profile_interaction_id: dailyDatingProfileInteraction.dailyDatingProfileInteractionId,
      daily_dating_profile_id: dailyDatingProfileInteraction.dailyDatingProfileId,
      dating_profile_id: dailyDatingProfileInteraction.datingProfileId,
      is_liked: dailyDatingProfileInteraction.isLiked,
    }
  }
}
