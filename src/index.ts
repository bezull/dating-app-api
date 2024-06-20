import { AppConfiguration } from './config/appConfig'
import { sequelizeConnection } from './shared/infra/database/index'
import { SequelizeConnection } from './shared/infra/database/sequelize/sequelizeConnection'
import { WebServer } from './shared/infra/http/webServer'

class Main {
  private webServer: WebServer
  private sequelizeConnection: SequelizeConnection
  private config: AppConfiguration
  constructor() {
    this.config = new AppConfiguration()
    this.sequelizeConnection = sequelizeConnection
    this.webServer = new WebServer({ port: this.config.appEnv.port })
  }

  async start() {
    this.sequelizeConnection.connect()
    await this.webServer.start()
  }
}

Promise.all([new Main()]).then(([main]) => {
  main.start()
})
