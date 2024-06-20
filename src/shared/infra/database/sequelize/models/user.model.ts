import { Column, CreatedAt, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'

export interface UserAttributes {
  userId: string
  email: string
  name: string
  password: string
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
  userId: string

  @Column
  email: string

  @Column
  name: string

  @Column
  password: string

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @DeletedAt
  deletedAt: Date
}
