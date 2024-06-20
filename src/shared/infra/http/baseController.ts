import { NextFunction, Request, Response } from 'express'
import { Logger } from '../logger'
import { SendJSONResponse } from './jsonResponse'

export class BaseController {
  async execute(req: Request, res: Response, _next: NextFunction) {
    // if (req.is('multipart/form-data')) {
    //   req.body = ObjectParser.parseUnparsedObject(req.body)
    // }

    try {
      await this.handleExecute(req, res)
    } catch (error) {
      Logger.error(`Unexpected Error %s`, error)
      Logger.error(`Request Log %s`, {
        requestUrl: `${req.method} ${req.baseUrl}${req.path}`,
        reqBody: req.body,
        reqQuery: req.query,
        reqParams: req.params,
      })
      SendJSONResponse.fail(res)
    }
  }

  // This method should be overridden by subclasses
  protected async handleExecute(_req: Request, _res: Response): Promise<Response> {
    throw new Error('Method should not implemented.')
  }
}
