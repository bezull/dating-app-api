import { DatingProfileAttributes } from '../../../shared/infra/database/mongoose/schemas/datingProfile.schema'
import { DatingProfile } from '../domain/datingProfile'

export class DatingProfileMap {
  static mapToPersistence(datingProfile: DatingProfile): DatingProfileAttributes {
    return {
      dating_profile_id: datingProfile.datingProfileId,
      user_id: datingProfile.userId,
      profile_pic_url: datingProfile.profilePicUrl,
      total_likes: datingProfile.totalLikes,
      total_pass: datingProfile.totalPass,
    }
  }

  static mapToDomain(raw: DatingProfileAttributes): DatingProfile {
    return DatingProfile.create(
      {
        userId: raw.user_id,
        name: raw.profile_pic_url,
        totalLikes: raw.total_likes,
        totalPass: raw.total_pass,
      },
      raw.dating_profile_id,
    ).getValue()
  }
}
