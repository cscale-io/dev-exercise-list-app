import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import { uploadFile } from '../aws/s3'
import prisma from '../prisma'
import { AuthUser } from './user'

type ListItem = {
  id: string
  name: string
  photoUrl?: string
}

type ListItemDetails = {
  id: string
  name: string
  description: string | null
  photoUrl?: string
  category: {
    id: string
    name: string
  }
}

export const listMyItems = async (authUser: AuthUser): Promise<ListItem[]> => {
  const items = await prisma.listItem.findMany({ where: { authorId: authUser.id } })

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    photoUrl: item.photoUrl ?? undefined,
  }))
}

export const getItemDetails = async (
  authUser: AuthUser,
  id: string,
): Promise<ListItemDetails | null> => {
  const listItem = await prisma.listItem.findFirst({
    where: {
      id,
      authorId: authUser.id,
    },
    include: {
      category: true,
    },
  })

  if (!listItem) return null

  return {
    id: listItem.id,
    name: listItem.name,
    description: listItem.description,
    photoUrl: listItem.photoUrl ?? undefined,
    category: {
      id: listItem.category.id,
      name: listItem.category.name,
    },
  }
}

export const createItem = async (
  authUser: AuthUser,
  name: string,
  categoryId: string,
  file: File | null,
  description?: string,
  photoUrl?: string,
): Promise<ListItem> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
    photoUrl: z.string().trim().optional(),
  })

  const parse = schema.safeParse({ name, description, photoUrl })

  if (!parse.success) {
    throw fromError(parse.error)
  }

  const data = parse.data

  const userExists = await prisma.user.findUnique({
    where: { id: authUser.id },
  })

  if (!userExists) throw new Error(`User with ID '${authUser.id}' not found.`)

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  })

  if (!categoryExists) throw new Error(`Category with ID '${categoryId}' not found.`)

  let finalPhotoUrl = data.photoUrl

  if (file) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const key = `uploads/${Date.now()}-${file.name}`
    finalPhotoUrl = await uploadFile(key, buffer, file.type)
  }

  const listItem = await prisma.listItem.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      authorId: authUser.id,
      photoUrl: finalPhotoUrl,
      categoryId,
    },
  })

  return {
    id: listItem.id,
    name: listItem.name,
    photoUrl: listItem.photoUrl ?? undefined,
  }
}
