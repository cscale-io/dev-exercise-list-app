import { NextRequest, NextResponse } from 'next/server'
import { createCategory } from '@/lib/models/category'

export async function POST(req: NextRequest) {
  try {
    // TODO (Improvement): require token and authenticate user 
    const formData = await req.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    await createCategory(name, description)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Error adding category:", error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
