import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'

export class DuplicatedDatingProfileInteracted extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, `Dating profile already interacted today`)
  }
}

export type SwipeLeftDatingProfileErrors =
  | DuplicatedDatingProfileInteracted
  | DatingProfileNotFound
  | SuccessOrFailureResult<string>
