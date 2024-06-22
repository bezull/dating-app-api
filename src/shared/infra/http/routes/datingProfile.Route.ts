import { Router } from 'express'
import { getDatingProfileController } from '../../../../modules/matches/useCases/getDatingProfile'
import { authMiddleware } from '../middlewares'

export class DatingProfileRoute {
  #router: Router = Router()

  constructor() {
    this.#router.get(
      '/',
      (req, res, next) => authMiddleware.ensureAuthenticated(req, res, next),
      (req, res, next) => getDatingProfileController.execute(req, res, next),
    )
  }

  get router() {
    return this.#router
  }
}
