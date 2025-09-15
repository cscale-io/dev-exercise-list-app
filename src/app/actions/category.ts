'use server'

import { createCategory } from '@/lib/models/category'
import { revalidatePath } from 'next/cache'

export async function createCategoryAction(formData: FormData) {
    const nameRaw = formData.get('name') as string
    const descriptionRaw = formData.get('description') 

    const name = typeof nameRaw === 'string' ? nameRaw : ''
    const description = typeof descriptionRaw === 'string' ? descriptionRaw : ''

    if (!name || name.trim() === '') {
        throw new Error('Name is required')
    }

    createCategory(name, description)

    revalidatePath('/')
}