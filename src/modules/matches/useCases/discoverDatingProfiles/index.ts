import {
  dailyDatingProfileInteractionRepository,
  dailyDatingProfileRepository,
  datingProfileRepository,
} from '../../repositories'
import { DiscoverDatingProfilesController } from './discoverDatingProfilesController'
import { DiscoverDatingProfilesUseCase } from './discoverDatingProfilesUseCase'

const discoverDatingProfilesUseCase = new DiscoverDatingProfilesUseCase(
  datingProfileRepository,
  dailyDatingProfileRepository,
  dailyDatingProfileInteractionRepository,
)

export const discoverDatingProfilesController = new DiscoverDatingProfilesController(discoverDatingProfilesUseCase)
