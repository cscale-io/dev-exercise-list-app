import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import prisma from '../prisma'

type CategoryResponse = {
  name: string
  description?: string | null
}

export const createCategory = async (
  name: string,
  description?: string,
): Promise<CategoryResponse> => {
  const schema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
  })

  const parse = schema.safeParse({ name, description })

  if (!parse.success) {
    throw fromError(parse.error)
  }

  const data = parse.data

  const categoryCreated = await prisma.category.create({
    data: {
      name: data.name,
      description: data?.description ?? null,
    },
  })

  return {
    name: categoryCreated.name,
    description: categoryCreated.description,
  }
}

export const listAllCategories = async (): Promise<CategoryResponse[]> => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}