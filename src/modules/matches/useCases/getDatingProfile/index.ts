import { userRepository } from '../../../users/repositories'
import { datingProfileRepository } from '../../repositories'
import { GetDatingProfileController } from './getDatingProfileController'
import { GetDatingProfileUseCase } from './getDatingProfileUseCase'

const getDatingProfileUseCase = new GetDatingProfileUseCase(userRepository, datingProfileRepository)
export const getDatingProfileController = new GetDatingProfileController(getDatingProfileUseCase)
