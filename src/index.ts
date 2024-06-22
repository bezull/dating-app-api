import { appConfig } from './config'
import { AppConfiguration } from './config/appConfig'
import { mongooseConnection, sequelizeConnection } from './shared/infra/database'
import { MongooseConnection } from './shared/infra/database/mongoose/mongooseConnection'
import { SequelizeConnection } from './shared/infra/database/sequelize/sequelizeConnection'
import { WebServer } from './shared/infra/http/webServer'

class Main {
  private webServer: WebServer
  private config: AppConfiguration
  private sequelizeConnection: SequelizeConnection
  private mongooseConnection: MongooseConnection
  constructor(
    appConfiguration: AppConfiguration,
    sequelizeConnection: SequelizeConnection,
    mongooseConnection: MongooseConnection,
  ) {
    this.config = appConfiguration
    this.sequelizeConnection = sequelizeConnection
    this.mongooseConnection = mongooseConnection
    this.webServer = new WebServer({ port: this.config.appEnv.port })
  }

  async start() {
    await this.sequelizeConnection.connect()
    await this.mongooseConnection.connect()
    await this.webServer.start()
  }
}

Promise.all([new Main(appConfig, sequelizeConnection, mongooseConnection)]).then(([main]) => {
  main.start()
})
