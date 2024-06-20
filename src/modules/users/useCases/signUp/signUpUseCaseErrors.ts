import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'

export class DuplicateEmailError extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'Email already in use')
  }
}

export type SignUpUseCaseErrors = DuplicateEmailError
