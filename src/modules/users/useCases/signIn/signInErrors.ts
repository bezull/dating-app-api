import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'

export class EmailNotFound extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'Email not found')
  }
}

export class InvalidCredential extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'Invalid email or password')
  }
}

export type SignInErrors = EmailNotFound | InvalidCredential
