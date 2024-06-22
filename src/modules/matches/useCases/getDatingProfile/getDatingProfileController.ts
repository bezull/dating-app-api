import { Request, Response } from 'express'
import { BaseController } from '../../../../shared/infra/http/baseController'
import { SendJSONResponse } from '../../../../shared/infra/http/jsonResponse'
import { DatingProfileNotFound, UserNotFound } from './getDatingProfileErrrors'
import { GetDatingProfileUseCase } from './getDatingProfileUseCase'

export class GetDatingProfileController extends BaseController {
  #useCase: GetDatingProfileUseCase

  constructor(useCase: GetDatingProfileUseCase) {
    super()
    this.#useCase = useCase
  }

  protected async handleExecute(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const useCaseResult = await this.#useCase.execute({
      userId: user.userId,
    })

    if (useCaseResult.isLeft()) {
      const error = useCaseResult.error
      switch (error.constructor) {
        case DatingProfileNotFound:
        case UserNotFound:
          return SendJSONResponse.fail(res)
        default:
          return SendJSONResponse.fail(res)
      }
    } else {
      return SendJSONResponse.ok(res, useCaseResult.value.getValue())
    }
  }
}
