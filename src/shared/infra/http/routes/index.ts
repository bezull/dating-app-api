import { Express } from 'express'
import { AuthRoute } from './authRoute'
import { DatingProfileRoute } from './datingProfile.Route'

export class Route {
  static loadRoutes(app: Express) {
    app.use('/auth', new AuthRoute().router)
    app.use('/dating-profiles', new DatingProfileRoute().router)
  }
}
