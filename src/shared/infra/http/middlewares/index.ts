import { authService } from '../../../../modules/users/services'
import { AuthMiddleware } from './authMiddleware'

export const authMiddleware = new AuthMiddleware(authService)
