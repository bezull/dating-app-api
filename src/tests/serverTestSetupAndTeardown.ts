import { sequelizeConnection } from '../shared/infra/database'
import { WebServer } from '../shared/infra/http/webServer'

const purgeDatabase = async () => {
  await sequelizeConnection.sequelize.sync({ force: true })
}

export const startServer = async (webServer: WebServer): Promise<WebServer> => {
  return new Promise((resolve, reject) => {
    try {
      webServer.start()
      resolve(webServer)
    } catch (error) {
      reject(error)
    }
  })
}

export const stopServer = async (webServer: WebServer): Promise<WebServer> => {
  return new Promise((resolve, reject) => {
    if (webServer) {
      webServer.stop()
      if (!webServer.isStarted) {
        return resolve(webServer)
      }
      return reject('Error when stopping server')
    }
  })
}

export const infraSetupAndTeardown = () => {
  beforeAll(async () => {
    await sequelizeConnection.connect()
    await purgeDatabase()
  })

  afterEach(async () => {
    await purgeDatabase()
  })

  afterAll(async () => {
    await sequelizeConnection.sequelize.close()
  })
}
