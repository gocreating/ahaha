import sequelize from '@/db/sequelize'
import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize'

export class EndUser extends Model<
  InferAttributes<EndUser, { omit: 'googleOauthUsers' | 'facebookOauthUsers' }>,
  InferCreationAttributes<EndUser>
> {
  declare reference?: string
  declare name?: string
  declare emailAddress: string
  declare isEmailAddressVerified: boolean
  declare hashedPassword?: string
  declare createTime: Date
  declare googleOauthUsers?: NonAttribute<GoogleOAuthUser[]>
  declare facebookOauthUsers?: NonAttribute<FacebookOAuthUser[]>
}

export class EndUserSession extends Model<
  InferAttributes<EndUserSession, { omit: 'endUser' }>,
  InferCreationAttributes<EndUserSession>
> {
  declare reference?: string
  declare isActive: boolean
  declare createTime: Date
  declare endUserReference: ForeignKey<string>
  declare endUser?: NonAttribute<EndUser>
}

export class GoogleOAuthUser extends Model<
  InferAttributes<GoogleOAuthUser>,
  InferCreationAttributes<GoogleOAuthUser>
> {
  declare reference?: string
  declare profile: object
  declare endUserReference: ForeignKey<string>
}

export class FacebookOAuthUser extends Model<
  InferAttributes<FacebookOAuthUser>,
  InferCreationAttributes<FacebookOAuthUser>
> {
  declare reference?: string
  declare profile: object
  declare endUserReference: ForeignKey<string>
}

EndUser.init(
  {
    reference: {
      field: 'reference',
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      field: 'name',
      type: DataTypes.TEXT,
    },
    emailAddress: {
      field: 'email_address',
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isEmailAddressVerified: {
      field: 'is_email_address_verified',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    hashedPassword: {
      field: 'hashed_password',
      type: DataTypes.TEXT,
    },
    createTime: {
      field: 'create_time',
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'end_user',
    timestamps: false,
  }
)

EndUserSession.init(
  {
    reference: {
      field: 'reference',
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createTime: {
      field: 'create_time',
      type: DataTypes.DATE,
      allowNull: false,
    },
    endUserReference: {
      field: 'end_user_reference',
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'end_user_session',
    timestamps: false,
  }
)

GoogleOAuthUser.init(
  {
    reference: {
      field: 'reference',
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profile: {
      field: 'profile',
      type: DataTypes.JSONB,
    },
    endUserReference: {
      field: 'end_user_reference',
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'google_oauth_user',
    timestamps: false,
  }
)

FacebookOAuthUser.init(
  {
    reference: {
      field: 'reference',
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profile: {
      field: 'profile',
      type: DataTypes.JSONB,
    },
    endUserReference: {
      field: 'end_user_reference',
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'facebook_oauth_user',
    timestamps: false,
  }
)

EndUser.hasMany(EndUserSession, {
  foreignKey: 'endUserReference',
  foreignKeyConstraint: true,
})
EndUserSession.belongsTo(EndUser, {
  foreignKey: 'endUserReference',
  as: 'endUser',
})

EndUser.hasMany(GoogleOAuthUser, {
  foreignKey: 'endUserReference',
  foreignKeyConstraint: true,
  as: 'googleOauthUsers',
})
EndUser.hasMany(FacebookOAuthUser, {
  foreignKey: 'endUserReference',
  foreignKeyConstraint: true,
  as: 'facebookOauthUsers',
})
