import { userRepository } from '../../repositories'
import { authService } from '../../services'
import { SignInController } from './signInController'
import { SignInUseCase } from './signInUseCase'

const signInUseCase = new SignInUseCase(userRepository, authService)
export const signInController = new SignInController(signInUseCase)
