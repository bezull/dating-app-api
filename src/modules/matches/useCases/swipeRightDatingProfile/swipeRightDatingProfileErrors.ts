import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'
import { DuplicateDatingProfileError } from '../createDatingProfile/createDatingProfileErrors'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'

export type SwipeRightDatingProfileErrors =
  | DuplicateDatingProfileError
  | DatingProfileNotFound
  | SuccessOrFailureResult<string>
