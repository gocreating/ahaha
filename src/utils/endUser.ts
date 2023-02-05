import {
  EndUser,
  EndUserSession,
  FacebookOAuthUser,
  GoogleOAuthUser,
} from '@/db/models'
import sequelize from '@/db/sequelize'

export const signinEndUser = async (endUser: any) => {
  const endUserSessions = await EndUserSession.findAll({
    where: {
      endUserReference: endUser.reference,
      isActive: true,
    },
  })
  endUserSessions.forEach(async (endUserSession: any) => {
    endUserSession.isActive = false
    await endUser.save()
  })
  const endUserSession = await sequelize.transaction(async (t) => {
    const endUserSession = await EndUserSession.create(
      {
        endUserReference: endUser.reference,
        createTime: new Date().toISOString(),
        isActive: true,
      },
      { transaction: t }
    )
    return endUserSession
  })
  return endUserSession as any
}

/*
Sample decodedData
{
  iss: 'https://accounts.google.com',
  azp: '1069250879918-5j8sqh8in0eu15gnue9qsk6fe7p8fqn7.apps.googleusercontent.com',
  aud: '1069250879918-5j8sqh8in0eu15gnue9qsk6fe7p8fqn7.apps.googleusercontent.com',
  sub: '104424308010635546950',
  email: 'gocreating@gmail.com',
  email_verified: true,
  at_hash: '1lM7wxiL2dV14dNRpXpBOw',
  name: 'CP Weng',
  picture: 'https://lh3.googleusercontent.com/a/AEdFTp4G78tdkE9KVZbtGuRFBhc-bOw7owxGmwWn-MPU7Q=s96-c',
  given_name: 'CP',
  family_name: 'Weng',
  locale: 'zh-TW',
  iat: 1675503976,
  exp: 1675507576
}
*/
export const createGoogleOAuthUserIfNotExist = async (profile: any) => {
  const endUsers = await EndUser.findAll({
    where: {
      emailAddress: profile.email,
      isEmailAddressVerified: true,
    },
    include: [
      {
        model: GoogleOAuthUser,
        as: 'googleOauthUsers',
        attributes: ['reference', 'profile'],
      },
    ],
  })
  const endUser = await sequelize.transaction(async (t) => {
    let endUser
    if (endUsers.length > 0) {
      endUser = endUsers[0]
    } else {
      endUser = await EndUser.create(
        {
          emailAddress: profile.email,
          isEmailAddressVerified: true,
          name: profile.name,
        },
        { transaction: t }
      )
    }
    let googleOauthUser = (endUser as any).googleOauthUsers?.[0]
    if (!googleOauthUser) {
      googleOauthUser = await GoogleOAuthUser.create(
        {
          endUserReference: (endUser as any).reference,
          profile,
        },
        { transaction: t }
      )
    }
    ;(endUser as any).isEmailAddressVerified = true
    googleOauthUser.profile = profile
    if (!(endUser as any).name) {
      ;(endUser as any).name = googleOauthUser.profile.name
    }
    return endUser
  })
  return endUser
}

/*
Sample profile
{
  id: '5957827807637859',
  first_name: '治平',
  last_name: '翁',
  name: '翁治平',
  name_format: '{last}{first}',
  picture: {
    data: {
      height: 50,
      is_silhouette: false,
      url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=5957827807637859&height=50&width=50&ext=1678123691&hash=AeSbbh9T5o2dCVRuv4E',
      width: 50
    }
  },
  short_name: '翁治平',
  email: 'gocreating@gmail.com'
}
*/
export const createFacebookOAuthUserIfNotExist = async (profile: any) => {
  const endUsers = await EndUser.findAll({
    where: {
      emailAddress: profile.email,
    },
    include: [
      {
        model: FacebookOAuthUser,
        as: 'facebookOauthUsers',
        attributes: ['reference', 'profile'],
      },
    ],
  })
  const endUser = await sequelize.transaction(async (t) => {
    let endUser
    if (endUsers.length > 0) {
      endUser = endUsers[0]
    } else {
      endUser = await EndUser.create(
        {
          emailAddress: profile.email,
          isEmailAddressVerified: true,
          name: profile.name,
        },
        { transaction: t }
      )
    }
    let facebookOauthUser = (endUser as any).facebookOauthUsers?.[0]
    if (!facebookOauthUser) {
      facebookOauthUser = await FacebookOAuthUser.create(
        {
          endUserReference: (endUser as any).reference,
          profile,
        },
        { transaction: t }
      )
    }
    ;(endUser as any).isEmailAddressVerified = true
    facebookOauthUser.profile = profile
    if (!(endUser as any).name) {
      ;(endUser as any).name = facebookOauthUser.profile.name
    }
    return endUser
  })
  return endUser
}
