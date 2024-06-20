import winston, { Logger } from 'winston'

export class Logging {
  #logger: Logger

  constructor() {
    this.initializeWinston()
  }

  get logger() {
    return this.#logger
  }

  private initializeWinston() {
    this.#logger = winston.createLogger({
      transports: this.getTransports(),
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.prettyPrint(),
        winston.format.simple(),
        winston.format.printf(({ level, message, namespace }) => {
          if (message.constructor === Object || message.constructor === Array) {
            message = JSON.stringify(message, null, 2)
          }

          return `[${level}]${namespace ? ` ${namespace}: ` : ': '}${message}`
        }),
      ),
    })
  }

  private getTransports(): winston.transport[] {
    const transports = [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.json(),
      }),
      new winston.transports.Http({
        level: 'warn',
        format: winston.format.json(),
      }),
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      }),
    ]

    return transports
  }
}
