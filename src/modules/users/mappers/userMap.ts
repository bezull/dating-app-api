import { UserAttributes } from '../../../shared/infra/database/sequelize/models/user.model'
import { User } from '../domain/user'

export class UserMap {
  static mapToPersistence(user: User): UserAttributes {
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      password: user.password,
    }
  }

  static mapToDomain(raw: UserAttributes): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.userId,
    ).getValue()
  }
}
