import jwt from 'jsonwebtoken'
import { AppConfiguration } from '../../../../config/appConfig'
import { AccessToken, JWT } from '../../domain/jwt'

export class AuthService {
  #appConfiguration: AppConfiguration

  constructor(appConfiguration: AppConfiguration) {
    this.#appConfiguration = appConfiguration
  }

  signJWT(payload: JWT): AccessToken {
    const expires = new Date(new Date().getTime() + this.#appConfiguration.jwtEnv.expiresInMinutes * 60 * 1000)
    const jwtToken = jwt.sign(payload, this.#appConfiguration.jwtEnv.secret, {
      expiresIn: this.#appConfiguration.jwtEnv.expiresInMinutes * 60,
    })
    return {
      token: jwtToken,
      expires_at: expires,
    }
  }
  decodeJWT(token: string): JWT | null {
    return jwt.decode(token, { json: true, complete: true })?.payload as JWT | null
  }

  verifyJWT(token: string): JWT {
    return jwt.verify(token, this.#appConfiguration.jwtEnv.secret, {}) as JWT
  }
}
