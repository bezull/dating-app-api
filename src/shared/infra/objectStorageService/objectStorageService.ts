import { SuccessOrFailure } from '../../core/result/successOrFailureResult'
import { UploadedObject, UploadObject } from './domain/uploadObject'

export interface ObjectStorageService {
  save(contentKey: string, file: UploadObject): Promise<SuccessOrFailure<UploadedObject>>
  saveBulk(baseContentKey: string, files: UploadObject[]): Promise<SuccessOrFailure<UploadedObject[]>>
}
