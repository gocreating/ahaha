import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.SEQUELIZE_DB_URL as string, {
  logging: false,
})

export default sequelize
