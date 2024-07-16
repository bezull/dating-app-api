import { SearchResult } from '../../../../shared/core/result/searchResult'
import { SuccessOrFailureResult } from '../../../../shared/core/result/successOrFailureResult'
import { UploadObjectTypeValues } from '../../../../shared/infra/objectStorageService/domain/uploadObjectEnum'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'

export class InvalidUploadObjectTypeFormat extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, `Invalid upload object type format, ${UploadObjectTypeValues.join(', ')} are allowed`)
  }
}

export class ErrorUploadProfilePicture extends SuccessOrFailureResult<string> {
  constructor() {
    super(false, 'Error uploading profile picture')
  }
}

export type UpdateDatingProfileError =
  | DatingProfileNotFound
  | InvalidUploadObjectTypeFormat
  | ErrorUploadProfilePicture
  | SearchResult<unknown>
