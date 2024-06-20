import 'dotenv/config'
import { Dialect } from 'sequelize'

type AppEnv = {
  name?: string
  port: number
  environtment: string
}

type SqlEnv = {
  database: string
  host: string
  port: number
  username: string
  password: string
  dialect: Dialect
}

export class AppConfiguration {
  #appEnv!: AppEnv
  #sqlEnv!: SqlEnv

  constructor() {
    this.loadAppEnv()
    this.loadSqlEnv()
  }

  get appEnv() {
    return this.#appEnv
  }

  get sqlEnv() {
    return this.#sqlEnv
  }

  private loadAppEnv() {
    this.#appEnv = {
      name: process.env.APP_NAME,
      environtment: process.env.APP_ENV ?? 'development',
      port: Number(process.env.APP_PORT) ?? 3000,
    }
  }

  private loadSqlEnv() {
    const { SQL_DATABASE, SQL_HOST, SQL_PORT, SQL_USERNAME, SQL_PASSWORD, SQL_DIALECT } = process.env
    const requiredEnvVars = ['SQL_DATABASE', 'SQL_HOST', 'SQL_PORT', 'SQL_USERNAME', 'SQL_PASSWORD', 'SQL_DIALECT']

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`${envVar} is required`)
      }
    }

    this.#sqlEnv = {
      host: SQL_HOST!,
      port: Number(SQL_PORT),
      database: SQL_DATABASE!,
      username: SQL_USERNAME!,
      password: SQL_PASSWORD!,
      dialect: SQL_DIALECT! as Dialect,
    }
  }
}
