import mongoose, { Mongoose, MongooseOptions } from 'mongoose'
import { AppConfiguration } from '../../../../config/appConfig'

export class MongooseConnection {
  #mongoose: Mongoose
  #options: MongooseOptions
  #appConfiguration: AppConfiguration
  constructor(appConfiguration: AppConfiguration) {
    this.#appConfiguration = appConfiguration
  }

  get mongoose() {
    return this.#mongoose
  }

  async connect() {
    try {
      this.#mongoose = await mongoose.connect(this.#appConfiguration.mongoEnv.uri, this.#options)
    } catch (err) {
      throw new Error('Error Mongoose Connection')
    }
  }

  async close() {
    if (this.#mongoose) {
      this.#mongoose.disconnect()
    }
  }
}
