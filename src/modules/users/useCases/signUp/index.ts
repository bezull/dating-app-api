import { userRepository } from '../../repositories'
import { SignUpController } from './signUpController'
import { SignUpUseCase } from './signUpUseCase'

const signUpUseCase = new SignUpUseCase(userRepository)
export const signUpController = new SignUpController(signUpUseCase)
