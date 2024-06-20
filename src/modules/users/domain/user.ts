import { v4 as uuidv4 } from 'uuid'
import { Guard } from '../../../shared/core/guard'
import { Result } from '../../../shared/core/result/result'
import { SuccessOrFailure } from '../../../shared/core/result/successOrFailureResult'
import { HashedPassword } from './hashedPassword'

type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class User {
  #props: UserProps
  #id: string

  constructor(props: UserProps, id?: string) {
    this.#props = props
    this.#id = id ?? uuidv4()
  }

  get userId() {
    return this.#id
  }

  get name() {
    return this.#props.name
  }

  get email() {
    return this.#props.email.toLocaleLowerCase()
  }

  get password() {
    return this.#props.password
  }

  async hashPassword() {
    this.#props.password = (await HashedPassword.hash(this.#props.password)).getValue().value
  }

  static create(props: UserProps, id?: string): SuccessOrFailure<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.name,
        argumentName: 'name',
      },
      {
        argument: props.email,
        argumentName: 'email',
      },
      {
        argument: props.password,
        argumentName: 'password',
      },
    ])

    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue())
    }

    return Result.ok(
      new User(
        {
          ...props,
        },
        id,
      ),
    )
  }
}
