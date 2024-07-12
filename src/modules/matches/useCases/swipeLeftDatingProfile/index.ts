import {
  dailyDatingProfileInteractionRepository,
  dailyDatingProfileRepository,
  datingProfileRepository,
} from '../../repositories'
import { SwipeLeftDatingProfileController } from './swipeLeftDatingProfileController'
import { SwipeLeftDatingProfileUseCase } from './swipeLeftDatingProfileUseCase'

export const swipeLeftDatingProfileUseCase = new SwipeLeftDatingProfileUseCase(
  datingProfileRepository,
  dailyDatingProfileRepository,
  dailyDatingProfileInteractionRepository,
)

export const swipeLeftDatingProfileController = new SwipeLeftDatingProfileController(swipeLeftDatingProfileUseCase)
