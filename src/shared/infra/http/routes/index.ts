import { Express } from 'express'
import { AuthRoute } from './authRoute'

export class Route {
  static loadRoutes(app: Express) {
    app.use('/auth', new AuthRoute().router)
  }
}
