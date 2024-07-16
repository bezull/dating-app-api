import { Column, CreatedAt, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'

export interface UserAttributes {
  userId: string
  email: string
  name: string
  password: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

@Table({
  tableName: 'users',
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class UserModel extends Model<UserAttributes> {
  @PrimaryKey
  @Column
  declare userId: string

  @Column
  declare email: string

  @Column
  declare name: string

  @Column
  declare password: string

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date

  @DeletedAt
  declare deletedAt: Date
}
