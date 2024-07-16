import { objectStorageService } from '../../../../shared/infra/objectStorageService'
import { datingProfileRepository } from '../../repositories'
import { UpdateDatingProfileController } from './updateDatingProfileController'
import { UpdateDatingProfileUseCase } from './updateDatingProfileUseCase'

export const updateDatingProfileUseCase = new UpdateDatingProfileUseCase(datingProfileRepository, objectStorageService)
export const updateDatingProfileController = new UpdateDatingProfileController(updateDatingProfileUseCase)
