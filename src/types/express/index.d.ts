export {}

declare global {
  namespace Express {
    interface Request {
      user?: import('../../shared/infra/http/request/userRequest').UserRequest
    }
  }
}
