import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import prisma from '../prisma'

type Category = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  description: string | null
}

export const createCategory = async (name: string, description?: string): Promise<Category> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    description: z.string().trim().optional(),
  })

  const now = new Date().toISOString()

  const parse = schema.safeParse({
    name: name,
    createdAt: now,
    updatedAt: now,
    description: description,
  })

  if (!parse.success) {
    throw fromError(parse.error)
  }

  const data = parse.data
  const category = await prisma.category.create({
    data: {
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      description: data.description,
    },
  })

  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    description: category.description,
  }
}

export const listCategories = async (limit: number = 20): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    take: limit,
  })

  return categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    description: item.description,
  }))
}
