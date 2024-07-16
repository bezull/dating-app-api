import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { getDatingProfileController } from '../../../../modules/matches/useCases/getDatingProfile'

import { updateDatingProfileController } from '../../../../modules/matches/useCases/updateDatingProfile'
import { authMiddleware } from '../middlewares'

export class DatingProfileRoute {
  #router: Router = Router()

  constructor() {
    this.#router.get(
      '/',
      (req, res, next) => authMiddleware.ensureAuthenticated(req, res, next),
      (req, res, next) => getDatingProfileController.execute(req, res, next),
    )
    this.#router.patch(
      '/',
      (req, res, next) => authMiddleware.ensureAuthenticated(req, res, next),
      fileUpload(),
      (req, res, next) => updateDatingProfileController.execute(req, res, next),
    )
  }

  get router() {
    return this.#router
  }
}
