import type { Payload } from 'payload'

export const seedSuperAdmin = async (payload: Payload): Promise<void> => {
  const superAdmin = await payload.find({
    collection: 'users',
    where: {
      role: {
        equals: 'superAdmin',
      },
    },
  })

  if (superAdmin.docs.length) return

  payload.logger.info('---- CREATE MESO SUPERADMIN ::: superadmin@meso.design - changeMe  ----')

  await payload.create({
    collection: 'users',
    data: {
      email: 'superadmin@meso.design',
      password: 'changeMe',
      role: 'superAdmin',
    },
  })
}
