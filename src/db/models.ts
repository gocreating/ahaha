import { DataTypes } from 'sequelize'
import sequelize from './sequelize'

export const EndUser = sequelize.define(
  'EndUser',
  {
    reference: {
      field: 'reference',
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
    },
    emailAddress: {
      field: 'email_address',
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailAddressVerified: {
      field: 'is_email_address_verified',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    hashedPassword: {
      field: 'hashed_password',
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    tableName: 'end_user',
    timestamps: false,
  }
)
