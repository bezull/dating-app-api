import { sequelizeConnection } from '../shared/infra/database'

const purgeDatabase = async () => {
  await sequelizeConnection.sequelize.sync({ force: true })
}

export const infraSetupAndTeardown = () => {
  beforeAll(async () => {
    await sequelizeConnection.connect()
    await purgeDatabase()
  })

  afterEach(async () => {
    await purgeDatabase()
  })

  afterAll(async () => {
    await sequelizeConnection.sequelize.close()
  })
}
