import { datingProfileRepository } from '../../repositories'
import { CreateDatingProfileUseCase } from './createDatingProfileUseCase'

export const createDatingProfileUseCase = new CreateDatingProfileUseCase(datingProfileRepository)
