import compression from 'compression'
import express, { Express } from 'express'
import helmet from 'helmet'
import { Server } from 'http'
import { Logger } from '../logger'
import { formatAPIRes } from './jsonResponse'
import { Route } from './routes'

export type HttpConfiguration = {
  port: number
}

export class WebServer {
  private express: Express
  private server: Server | undefined
  private started = false

  constructor(private config: HttpConfiguration) {
    this.express = this.createExpress()
    this.configureExpress()
    this.setupRoutes()
    this.setupDefaultRoutes()
  }

  private createExpress() {
    return express()
  }

  private configureExpress() {
    this.express.use(helmet())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(compression())
  }

  private setupRoutes() {
    Route.loadRoutes(this.express)
  }

  private setupDefaultRoutes() {
    this.express.get('/', (_req, res) => {
      res.status(200).send(formatAPIRes(200, { message: 'Hello world' }))
    })

    this.express.use((req, res) => {
      res
        .status(404)
        .send(formatAPIRes(404, { message: `${req.protocol}://${req.hostname}${req.originalUrl} url not found` }))
    })
  }

  getHttp() {
    if (!this.server) throw new Error(`Server not yet started`)
    return this.server
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.express.listen(this.config.port, () => {
        this.started = true
        Logger.info(`Server started on port ${this.config.port}`)
        resolve()
      })
    })
  }

  isStarted() {
    return this.started
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.started = false
          resolve()
        })
      }
    })
  }
}
