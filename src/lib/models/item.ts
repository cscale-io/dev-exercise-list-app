import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import prisma from '../prisma'
import { AuthUser } from './user'

type ListItem = {
  id: string
  name: string
}

type ListItemDetails = {
  id: string
  name: string
  photoUrl: string
  category: string
  description: string | null
}

export const listMyItems = async (authUser: AuthUser): Promise<ListItem[]> => {
  const items = await prisma.listItem.findMany({ where: { authorId: authUser.id } })
  return items.map((item) => ({ id: item.id, name: item.name }))
}

export const getItemDetails = async (
  authUser: AuthUser,
  id: string,
): Promise<ListItemDetails | null> => {
  const listItem = await prisma.listItem.findFirst({ where: { id, authorId: authUser.id } })
  if (!listItem) return null

  const category = await prisma.category.findFirst({ where: {id: listItem.categoryId}})
  if (!category) return null
  const displayCategory = `${category?.name}${category?.description ? ` - ${category.description}` : ''}`;

  return {
    id: listItem.id,
    name: listItem.name,
    photoUrl: listItem.photoUrl,
    category: displayCategory,
    description: listItem.description,
  }
}

export const createItem = async (
  authUser: AuthUser,
  name: string,
  description: string,
  photoUrl: string,
  categoryId: string,
): Promise<ListItem> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    photoUrl: z.string().trim().url(),
    categoryId: z.string().trim().uuid(),
    description: z.string().trim().optional(),
  })

  const parse = schema.safeParse({ name, photoUrl, description, categoryId })

  if (!parse.success) {
    throw fromError(parse.error)
  }

  const data = parse.data
  const listItem = await prisma.listItem.create({
    data: {
      name: data.name,
      photoUrl: data.photoUrl,
      description: data.description,
      authorId: authUser.id,
      categoryId: data.categoryId,
    },
  })
  return { id: listItem.id, name: listItem.name }
}
