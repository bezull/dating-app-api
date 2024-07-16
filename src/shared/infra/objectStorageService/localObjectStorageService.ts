import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Result } from '../../core/result/result'
import { SuccessOrFailure } from '../../core/result/successOrFailureResult'
import { Logger } from '../logger'
import { UploadObject, UploadedObject } from './domain/uploadObject'
import { ObjectStorageService } from './objectStorageService'

export class LocalObjectStorageService implements ObjectStorageService {
  async save(contentKey: string, file: UploadObject): Promise<SuccessOrFailure<UploadedObject>> {
    try {
      const dir = path.dirname(path.join(__dirname, `tests/localTempDir/${contentKey}`))
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      const fileName = `${contentKey}-${uuidv4()}.${file.extension}`
      fs.writeFileSync(path.join(__dirname, `tests/localTempDir/${fileName}`), file.buffer)

      return Result.ok({
        url: fileName,
        type: file.type,
      })
    } catch (error) {
      Logger.error('Error saving file', error)
      return Result.fail('Error saving file')
    }
  }
  async saveBulk(baseContentKey: string, files: UploadObject[]): Promise<SuccessOrFailure<UploadedObject[]>> {
    return Promise.all(files.map((file) => this.save(baseContentKey, file)))
      .then((results) => {
        const successfulUploads = results.filter(
          (result): result is SuccessOrFailure<UploadedObject> => result.isSuccess,
        )
        return Result.ok(successfulUploads.map((result) => result.getValue())) as SuccessOrFailure<UploadedObject[]>
      })
      .catch((err) => Result.fail(err))
  }
}
