import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/aws/s3'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const key = `uploads/${Date.now()}-${file.name}`

    const url = await uploadFile(key, buffer, file.type)

    return NextResponse.json({ url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 })
  }
}
