import { Schema, model } from 'mongoose'

export interface DailyDatingProfileAttributes {
  daily_dating_profile_id: string
  user_id: string
  date: string
  total_interactions: number
}

const dailyDatingProfileSchema = new Schema<DailyDatingProfileAttributes>({
  daily_dating_profile_id: { type: String, required: true },
  user_id: { type: String, required: true },
  date: { type: String, required: true },
  total_interactions: { type: Number, default: 0 },
})

export const DailyDatingProfileSchema = model<DailyDatingProfileAttributes>(
  'DailyDatingProfile',
  dailyDatingProfileSchema,
)
