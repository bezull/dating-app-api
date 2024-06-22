import { Response } from 'express'

export const formatAPIRes = (code: number, data: unknown) => {
  return {
    status: code >= 400 ? 'failure' : 'success',
    code,
    data,
  }
}

export class SendJSONResponse {
  static clientError(res: Response, message = 'Client error') {
    res.locals.errorMessage = message
    return res.status(400).json(formatAPIRes(400, { message }))
  }
  static ok(res: Response, data: unknown) {
    return res.status(200).json(formatAPIRes(200, data))
  }

  static fail(res: Response, message = 'Unexpected error') {
    res.locals.errorMessage = message
    return res.status(500).json(formatAPIRes(500, { message }))
  }

  static notFound(res: Response, message = 'Not found') {
    res.locals.errorMessage = message
    return res.status(404).json(formatAPIRes(404, { message }))
  }

  static unprocessable(res: Response, message = 'Unprocessable Entity') {
    res.locals.errorMessage = message
    return res.status(422).json(formatAPIRes(422, { message }))
  }

  static forbidden(res: Response, message = 'Forbidden') {
    res.locals.errorMessage = message
    return res.status(403).json(formatAPIRes(403, { message }))
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    res.locals.errorMessage = message
    return res.status(401).json(formatAPIRes(401, { message }))
  }
}
