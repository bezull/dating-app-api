import {
  dailyDatingProfileInteractionRepository,
  dailyDatingProfileRepository,
  datingProfileRepository,
} from '../../repositories'
import { SwipeRightDatingProfileController } from './swipeRightDatingProfileController'
import { SwipeRightDatingProfileUseCase } from './swipeRightDatingProfileUseCase'

export const swipeRightDatingProfileUseCase = new SwipeRightDatingProfileUseCase(
  datingProfileRepository,
  dailyDatingProfileRepository,
  dailyDatingProfileInteractionRepository,
)

export const swipeRightDatingProfileController = new SwipeRightDatingProfileController(swipeRightDatingProfileUseCase)
