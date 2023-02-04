import { EndUser, GoogleOAuthUser } from '@/db/models'
import sequelize from '@/db/sequelize'

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
    include: [GoogleOAuthUser],
  })
  await sequelize.transaction(async (t) => {
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
    const googleOauthUser = await GoogleOAuthUser.create(
      {
        profile,
      },
      { transaction: t }
    )
    await (endUser as any).addGoogleOAuthUser(googleOauthUser)
    return endUser
  })
}