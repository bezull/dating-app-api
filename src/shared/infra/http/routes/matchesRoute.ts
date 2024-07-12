import { Router } from 'express'
import { discoverDatingProfilesController } from '../../../../modules/matches/useCases/discoverDatingProfiles'
import { swipeLeftDatingProfileController } from '../../../../modules/matches/useCases/swipeLeftDatingProfile'
import { authMiddleware } from '../middlewares'

export class MatchesRoute {
  #router: Router = Router()

  constructor() {
    this.#router.get(
      '/discover-dating-profiles',
      (req, res, next) => authMiddleware.ensureAuthenticated(req, res, next),
      (req, res, next) => discoverDatingProfilesController.execute(req, res, next),
    )
    this.#router.post(
      '/pass-dating-profile/:datingProfileId',
      (req, res, next) => authMiddleware.ensureAuthenticated(req, res, next),
      (req, res, next) => swipeLeftDatingProfileController.execute(req, res, next),
    )
  }

  get router() {
    return this.#router
  }
}
