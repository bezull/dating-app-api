import { Request, Response } from 'express'
import { BaseController } from '../../../../shared/infra/http/baseController'
import { SendJSONResponse } from '../../../../shared/infra/http/jsonResponse'
import { EmailNotFound, InvalidCredential } from './signInErrors'
import { SignInUseCase } from './signInUseCase'

export class SignInController extends BaseController {
  #useCase: SignInUseCase

  constructor(useCase: SignInUseCase) {
    super()
    this.#useCase = useCase
  }

  protected async handleExecute(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    if (!email) return SendJSONResponse.clientError(res, 'email is required')

    if (!password) return SendJSONResponse.clientError(res, 'password is required')

    const useCaseResult = await this.#useCase.execute({
      email,
      password,
    })

    if (useCaseResult.isLeft()) {
      const error = useCaseResult.error
      switch (error.constructor) {
        case EmailNotFound:
        case InvalidCredential:
          return SendJSONResponse.clientError(res, error.getErrorValue())
        default:
          return SendJSONResponse.fail(res)
      }
    }

    return SendJSONResponse.ok(res, useCaseResult.value.getValue())
  }
}
