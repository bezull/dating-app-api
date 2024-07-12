import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'

export class DatingProfileNotFound extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'Dating profile not found')
  }
}

export class UserNotFound extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, `User is not found`)
  }
}

export type GetDatingProfileErrors = DatingProfileNotFound | UserNotFound
