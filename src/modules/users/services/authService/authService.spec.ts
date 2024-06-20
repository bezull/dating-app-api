import { v4 as uuidv4 } from 'uuid'
import { authService } from '..'
import { JWT } from '../../domain/jwt'

describe('AuthService', () => {
  it('should able to sign jwt', () => {
    const payload: JWT = {
      userId: uuidv4(),
    }

    const signedJWT = authService.signJWT(payload)
    expect(signedJWT).toBeDefined()
  })

  it('should able to decode jwt', () => {
    const payload: JWT = {
      userId: uuidv4(),
    }

    const signedJWT = authService.signJWT(payload)

    const decodedJWT = authService.decodeJWT(signedJWT)
    expect(decodedJWT?.userId).toBe(payload.userId)
  })

  it('should able to verify jwt', () => {
    const payload: JWT = {
      userId: uuidv4(),
    }

    const signedJWT = authService.signJWT(payload)

    const verifiedJWT = authService.verifyJWT(signedJWT)
    expect(verifiedJWT?.userId).toBe(payload.userId)
  })
})
