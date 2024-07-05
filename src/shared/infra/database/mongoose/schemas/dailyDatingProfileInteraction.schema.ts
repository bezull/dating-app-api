import { Schema, model } from 'mongoose'

export interface DailyDatingProfileInteractionAttributes {
  daily_dating_profile_interaction_id: string
  daily_dating_profile_id: string
  dating_profile_id: string
  is_liked: boolean
}

const dailyDatingProfileInteractionSchema = new Schema<DailyDatingProfileInteractionAttributes>({
  daily_dating_profile_interaction_id: { type: String, required: true },
  daily_dating_profile_id: { type: String, required: true },
  dating_profile_id: { type: String, required: true },
  is_liked: { type: Boolean, required: true, default: false },
})

export const DailyDatingProfileInteractionSchema = model<DailyDatingProfileInteractionAttributes>(
  'DailyDatingProfileInteraction',
  dailyDatingProfileInteractionSchema,
)
