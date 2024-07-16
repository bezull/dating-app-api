import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { Either, Left, Right } from '../../../../shared/core/result/either'
import { BaseController } from '../../../../shared/infra/http/baseController'
import { SendJSONResponse } from '../../../../shared/infra/http/jsonResponse'
import { UploadObject } from '../../../../shared/infra/objectStorageService/domain/uploadObject'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'
import { ErrorUploadProfilePicture, InvalidUploadObjectTypeFormat } from './updateDatingProfileErrors'
import { UpdateDatingProfileUseCase } from './updateDatingProfileUseCase'

export class UpdateDatingProfileController extends BaseController {
  #useCase: UpdateDatingProfileUseCase

  constructor(useCase: UpdateDatingProfileUseCase) {
    super()
    this.#useCase = useCase
  }

  protected async handleExecute(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const profilePicResult = this.#getProfilePic(req)
    if (profilePicResult.isLeft()) {
      return SendJSONResponse.unprocessable(res, profilePicResult.error)
    }

    const useCaseResult = await this.#useCase.execute({
      userId: user.userId,
      name: req.body.name,
      profilePic: profilePicResult.value,
    })

    if (useCaseResult.isLeft()) {
      const error = useCaseResult.error
      switch (error.constructor) {
        case InvalidUploadObjectTypeFormat:
          return SendJSONResponse.unprocessable(res, useCaseResult.error.getErrorValue())
        case ErrorUploadProfilePicture:
        case DatingProfileNotFound:
        default:
          return SendJSONResponse.fail(res)
      }
    } else {
      return SendJSONResponse.ok(res, useCaseResult.value)
    }
  }

  #getProfilePic(req: Request): Either<string, UploadObject | undefined> {
    if (!req.files) return Right.create(undefined)
    const profilePic = req.files.profile_pic as UploadedFile

    if (profilePic.mimetype !== 'image/jpeg' && profilePic.mimetype !== 'image/png') {
      return Left.create(new InvalidUploadObjectTypeFormat().getErrorValue())
    }
    return Right.create({
      buffer: profilePic.data,
      extension: profilePic.mimetype.split('/')[1],
      type: 'media',
    })
  }
}
