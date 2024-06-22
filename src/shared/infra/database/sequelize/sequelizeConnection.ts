import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { AppConfiguration } from '../../../../config/appConfig'

export class SequelizeConnection {
  #options: SequelizeOptions = {}
  #sequelize: Sequelize
  #appConfiguration: AppConfiguration

  constructor(appConfiguration: AppConfiguration) {
    this.#appConfiguration = appConfiguration
    this.setupConfiguration()
  }

  private setupConfiguration() {
    const sqlConn = this.#appConfiguration.sqlEnv
    this.#options = {
      database: sqlConn.database,
      host: sqlConn.host,
      port: sqlConn.port,
      username: sqlConn.username,
      password: sqlConn.password,
      dialect: 'mysql',
      logging: false,
    }
    return this
  }

  get sequelize() {
    return this.#sequelize
  }

  async connect() {
    try {
      this.#sequelize = new Sequelize(this.#options)
      this.#sequelize.addModels([__dirname + '/models/**/*.model.ts'], (filename, member) => {
        const name = filename.replace('.', '')
        return name.toLocaleLowerCase() === member.toLocaleLowerCase()
      })

      if (this.#appConfiguration.appEnv.environtment !== 'test') await this.#sequelize.sync({ alter: true })
    } catch (err) {
      throw new Error('Error Sequelize Connection')
    }
  }

  async close() {
    if (this.#sequelize) {
      this.#sequelize.close()
    }
  }
}
