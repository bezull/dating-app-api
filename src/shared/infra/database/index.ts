import { appConfig } from '../../../config'
import { SequelizeConnection } from './sequelize/sequelizeConnection'

export const sequelizeConnection = new SequelizeConnection(appConfig)
