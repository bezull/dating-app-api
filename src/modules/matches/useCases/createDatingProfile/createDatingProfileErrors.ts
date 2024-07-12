import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'

export class DuplicateDatingProfileError extends SuccessOrFailureResult<object> {
  constructor() {
    super(false, 'Dating profile already exists')
  }
}

export class FailCreatingDatingProfile extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'Fail when creating dating profile')
  }
}

export type CreateDatingProfileErrors = DuplicateDatingProfileError | FailCreatingDatingProfile
