export type SignInInputDTO = {
  email: string
  password: string
}

export type SignInOutputDTO = {
  user: {
    name: string
    email: string
  }
  token: {
    access_token: string
    expires_in: Date
  }
}
