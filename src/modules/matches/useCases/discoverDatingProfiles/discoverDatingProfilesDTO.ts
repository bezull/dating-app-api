import { GetDatingProfileOutputDTO } from '../getDatingProfile/getDatingProfileDTO'

export type DiscoverDatingProfilesInputDTO = {
  userId: string
}

export type DiscoverDatingProfilesOutputDTO = {
  limit: number
  datingProfiles: GetDatingProfileOutputDTO[]
}
