import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '../prisma'

export type AuthUser = {
  id: string
}

export const getCurrentAuthUser = async (): Promise<AuthUser> => {
  const { userId } = auth()
  if (!userId) throw new Error('User not found')

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!existingUser) {
    const clerkUser = await clerkClient.users.getUser(userId)

    await prisma.user.create({
      data: {
        id: userId,
        name: clerkUser.firstName || 'Usuário',
        email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.dev`,
        password: '',
      }
    })
  }

  return { id: userId }
}
