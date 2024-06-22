import { appConfig } from '../../../config'
import { MongooseConnection } from './mongoose/mongooseConnection'
import { SequelizeConnection } from './sequelize/sequelizeConnection'

export const sequelizeConnection = new SequelizeConnection(appConfig)
export const mongooseConnection = new MongooseConnection(appConfig)
