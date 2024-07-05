import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'

export class NoDiscoverableDatingProfiles extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'No discoverable dating profiles')
  }
}

export type DiscoverDatingProfileErrors = NoDiscoverableDatingProfiles | SuccessOrFailureResult<string>
