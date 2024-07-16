import { UploadObject } from '../../../../shared/infra/objectStorageService/domain/uploadObject'

export type UpdateDatingProfileInputDTO = {
  userId: string
  name?: string
  profilePic?: UploadObject
}

export type UpdateDatingProfileOutputDTO = {
  dating_profile_id: string
  name: string
  profile_pic_url: string
}
