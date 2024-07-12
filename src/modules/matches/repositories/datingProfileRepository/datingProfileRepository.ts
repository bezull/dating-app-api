import { Maybe } from '../../../../shared/core/result/searchResult'
import { SuccessOrFailure } from '../../../../shared/core/result/successOrFailureResult'
import { DatingProfile } from '../../domain/datingProfile'

export type DatingProfileFilter = {
  datingProfileId?: string
}

export interface DatingProfileRepository {
  getDatingProfileByFilter: (filter: DatingProfileFilter) => Promise<Maybe<DatingProfile>>
  getDatingProfileByUserId: (userId: string) => Promise<Maybe<DatingProfile>>
  getUninteractedDatingProfiles: (
    interactedDatingProfileIds: string[],
    excludeDatingProfileId: string,
  ) => Promise<DatingProfile[]>
  save: (datingProfile: DatingProfile) => Promise<SuccessOrFailure<void>>
  saveBulk: (datingProfiles: DatingProfile[]) => Promise<SuccessOrFailure<void>>
}
