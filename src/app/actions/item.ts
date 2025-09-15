'use server'

import { createItem } from '@/lib/models/item'
import { getCurrentAuthUser } from '@/lib/models/user'
import { revalidatePath } from 'next/cache'

export const addItemAction = async (formData: FormData): Promise<void> => {
  const authUser = await getCurrentAuthUser()

  const nameRaw = formData.get('name')
  const descriptionRaw = formData.get('description')
  const categoryIdRaw = formData.get('categoryId')
  const fileRaw = formData.get('photo')

  const name = typeof nameRaw === 'string' ? nameRaw : ''
  const description = typeof descriptionRaw === 'string' ? descriptionRaw : undefined
  const categoryId = typeof categoryIdRaw === 'string' ? categoryIdRaw.trim() : ''

  const isFileLike = (value: unknown): value is File => {
    return value !== null && typeof value === 'object' && 'arrayBuffer' in value && 'type' in value
  }

  const file = isFileLike(fileRaw) ? (fileRaw as File) : null

  await createItem(authUser, name, categoryId, file, description)

  revalidatePath('/')
}
