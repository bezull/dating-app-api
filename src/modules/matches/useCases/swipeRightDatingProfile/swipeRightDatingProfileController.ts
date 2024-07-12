import { Request, Response } from 'express'
import { BaseController } from '../../../../shared/infra/http/baseController'
import { SendJSONResponse } from '../../../../shared/infra/http/jsonResponse'
import { DatingProfileNotFound } from '../getDatingProfile/getDatingProfileErrors'
import { DuplicatedDatingProfileInteracted } from '../swipeLeftDatingProfile/swipeLeftDatingProfileErrors'
import { SwipeRightDatingProfileUseCase } from './swipeRightDatingProfileUseCase'

export class SwipeRightDatingProfileController extends BaseController {
  #useCase: SwipeRightDatingProfileUseCase

  constructor(useCase: SwipeRightDatingProfileUseCase) {
    super()
    this.#useCase = useCase
  }

  protected async handleExecute(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const useCaseResult = await this.#useCase.execute({
      userId: user.userId,
      datingProfileId: req.params.datingProfileId,
    })

    if (useCaseResult.isLeft()) {
      const error = useCaseResult.error

      switch (error.constructor) {
        case DuplicatedDatingProfileInteracted:
          return SendJSONResponse.clientError(res, error.getErrorValue())
        case DatingProfileNotFound:
          return SendJSONResponse.notFound(res, error.getErrorValue())
        default:
          return SendJSONResponse.fail(res)
      }
    } else {
      return SendJSONResponse.ok(res, useCaseResult.value)
    }
  }
}
