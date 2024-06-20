import { Request, Response } from 'express'
import { BaseController } from '../../../../shared/infra/http/baseController'
import { SendJSONResponse } from '../../../../shared/infra/http/jsonResponse'
import { DuplicateEmailError } from './signUpErrors'
import { SignUpUseCase } from './signUpUseCase'

export class SignUpController extends BaseController {
  #useCase: SignUpUseCase

  constructor(useCase: SignUpUseCase) {
    super()
    this.#useCase = useCase
  }

  protected async handleExecute(req: Request, res: Response): Promise<Response> {
    const { email, name, password } = req.body

    if (!email) {
      return SendJSONResponse.clientError(res, 'Email is required')
    }

    if (!name) {
      return SendJSONResponse.clientError(res, 'Name is required')
    }

    if (!password) {
      return SendJSONResponse.clientError(res, 'Password is required')
    }

    const useCaseResult = await this.#useCase.execute({
      email,
      name,
      password,
    })

    if (useCaseResult.isLeft()) {
      const error = useCaseResult.error
      switch (error.constructor) {
        case DuplicateEmailError:
          return SendJSONResponse.clientError(res, error.getErrorValue())

        default:
          return SendJSONResponse.fail(res)
      }
    } else {
      return SendJSONResponse.ok(res, useCaseResult.value.getValue())
    }
  }
}
