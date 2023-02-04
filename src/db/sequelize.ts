import * as pg from 'pg'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.SEQUELIZE_DB_URL as string, {
  logging: false,
  dialectModule: pg,
})

export default sequelize
