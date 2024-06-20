import { Router } from 'express'
import { signInController } from '../../../../modules/users/useCases/signIn'
import { signUpController } from '../../../../modules/users/useCases/signUp'

export class AuthRoute {
  #router: Router = Router()

  constructor() {
    this.#router.post('/sign-up', (req, res, next) => signUpController.execute(req, res, next))
    this.#router.post('/sign-in', (req, res, next) => signInController.execute(req, res, next))
  }

  get router() {
    return this.#router
  }
}
