import { Either, Left, Right } from '../../../../shared/core/result/either'
import { ObjectStorageService } from '../../../../shared/infra/objectStorageService/objectStorageService'
import { DatingProfileRepository } from '../../repositories/datingProfileRepository/datingProfileRepository'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'
import { UpdateDatingProfileInputDTO, UpdateDatingProfileOutputDTO } from './updateDatingProfileDTO'
import { ErrorUploadProfilePicture, UpdateDatingProfileError } from './updateDatingProfileErrors'

export type UpdateDatingProfileUseCaseOutput = Either<UpdateDatingProfileError, UpdateDatingProfileOutputDTO>

export class UpdateDatingProfileUseCase {
  #datingProfileRepo: DatingProfileRepository
  #objectStorageService: ObjectStorageService

  constructor(datingProfileRepo: DatingProfileRepository, objectStorageService: ObjectStorageService) {
    this.#datingProfileRepo = datingProfileRepo
    this.#objectStorageService = objectStorageService
  }

  async execute(dto: UpdateDatingProfileInputDTO): Promise<UpdateDatingProfileUseCaseOutput> {
    const { userId, name, profilePic } = dto

    const datingProfileResult = await this.#datingProfileRepo.getDatingProfileByUserId(userId)
    if (datingProfileResult.isNotFound) {
      return Left.create(new DatingProfileNotFound())
    }

    const datingProfile = datingProfileResult.getValue()

    if (name) {
      datingProfile.updateName(name)
    }

    if (profilePic) {
      const uploadedObjectResult = await this.#objectStorageService.save(
        `DatingProfiles/ProfilePicture/profile`,
        profilePic,
      )

      if (uploadedObjectResult.isFailure) {
        return Left.create(new ErrorUploadProfilePicture())
      }

      const uploadedObject = uploadedObjectResult.getValue()

      datingProfile.updateProfilePicUrl(uploadedObject.url)
    }

    await this.#datingProfileRepo.save(datingProfile)

    return Right.create({
      dating_profile_id: datingProfile.datingProfileId,
      name: datingProfile.name,
      profile_pic_url: datingProfile.profilePicUrl,
    })
  }
}
