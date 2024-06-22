import { Schema, model } from 'mongoose'

export interface DatingProfileAttributes {
  dating_profile_id: string
  user_id: string
  profile_pic_url: string
  total_likes: number
  total_pass: number
}

const datingProfileSchema = new Schema<DatingProfileAttributes>({
  dating_profile_id: { type: String, required: true },
  user_id: { type: String, required: true },
  profile_pic_url: { type: String, required: false },
  total_likes: { type: Number, required: true, default: 0 },
  total_pass: { type: Number, required: true, default: 0 },
})

export const DatingProfileSchema = model<DatingProfileAttributes>('DatingProfile', datingProfileSchema)
