import { mongooseConnection, sequelizeConnection } from '../src/shared/infra/database'
import { WebServer } from '../src/shared/infra/http/webServer'

const purgeDatabase = async () => {
  await sequelizeConnection.sequelize.sync({ force: true })
  await Promise.all(
    Object.values(mongooseConnection.mongoose.connection.collections).map(async (collection) =>
      collection.deleteMany(),
    ),
  )
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
    await mongooseConnection.connect()
    await purgeDatabase()
  })

  afterEach(async () => {
    await purgeDatabase()
  })

  afterAll(async () => {
    await sequelizeConnection.close()
    await mongooseConnection.close()
  })
}
