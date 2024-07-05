import { MongooseDailyDatingProfileInteractionRepository } from './dailyDatingProfileInteractionRepository/mongooseDailyDatingProfileInteractionRepository'
import { MongooseDailyDatingProfileRepository } from './dailyDatingProfileRepository/mongooseDailyDatingProfileRepository'
import { MongooseDatingProfileRepository } from './datingProfileRepository/mongooseDatingProfileRepository'

export const datingProfileRepository = new MongooseDatingProfileRepository()
export const dailyDatingProfileRepository = new MongooseDailyDatingProfileRepository()
export const dailyDatingProfileInteractionRepository = new MongooseDailyDatingProfileInteractionRepository()
