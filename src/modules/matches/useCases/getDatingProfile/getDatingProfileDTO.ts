export type GetDatingProfileInputDTO = {
  userId: string
}

export type GetDatingProfileOutputDTO = {
  dating_profile_id: string
  name: string
  profile_pic_url: string
  total_likes: number
  total_pass: number
}
