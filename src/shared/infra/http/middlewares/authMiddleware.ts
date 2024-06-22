import { NextFunction, Request, Response } from 'express'
import { AuthService } from '../../../../modules/users/services/authService/authService'
import { formatAPIRes } from '../jsonResponse'

export class AuthMiddleware {
  #authService: AuthService

  constructor(authService: AuthService) {
    this.#authService = authService
  }

  async ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) return res.status(401).json(formatAPIRes(401, { message: 'Unauthorized' }))

    const decoded = this.#authService.decodeJWT(token!)
    if (!decoded) return res.status(401).json(formatAPIRes(401, { message: 'Unauthorized' }))

    req.user = {
      userId: decoded!.userId,
    }

    return next()
  }
}
