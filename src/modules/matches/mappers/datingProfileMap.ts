import { DatingProfileAttributes } from '../../../shared/infra/database/mongoose/schemas/datingProfile.schema'
import { DatingProfile } from '../domain/datingProfile'
import { GetDatingProfileOutputDTO } from '../useCases/getDatingProfile/getDatingProfileDTO'

export class DatingProfileMap {
  static mapToPersistence(datingProfile: DatingProfile): DatingProfileAttributes {
    return {
      dating_profile_id: datingProfile.datingProfileId,
      name: datingProfile.name,
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
        name: raw.name,
        profilePicUrl: raw.profile_pic_url,
        totalLikes: raw.total_likes,
        totalPass: raw.total_pass,
      },
      raw.dating_profile_id,
    ).getValue()
  }

  static mapToDTO(datingProfile: DatingProfile): GetDatingProfileOutputDTO {
    return {
      dating_profile_id: datingProfile.datingProfileId,
      name: datingProfile.name,
      profile_pic_url: datingProfile.profilePicUrl,
      total_likes: datingProfile.totalLikes,
      total_pass: datingProfile.totalPass,
    }
  }
}
