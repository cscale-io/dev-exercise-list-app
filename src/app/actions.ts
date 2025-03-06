'use server'

import { createItem } from '@/lib/models/item'
import { listCategories } from '@/lib/models/category'
import { getCurrentAuthUser } from '@/lib/models/user'
import { revalidatePath } from 'next/cache'

export const addItemAction = async (formData: FormData): Promise<void> => {
  const authUser = getCurrentAuthUser()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const photoUrl = formData.get('photoUrl') as string
  const categoryId = formData.get('categoryId') as string
  await createItem(authUser, name, description, photoUrl, categoryId)
  revalidatePath('/')
}

export const fetchCategories = async () => {
  return await listCategories()
}
