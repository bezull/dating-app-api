import { appConfig } from '../../../config'
import { AuthService } from './authService/authService'

export const authService = new AuthService(appConfig)
