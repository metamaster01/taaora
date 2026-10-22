import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-guard'

// Vercel serverless request bodies are capped at ~4.5 MB, so cap uploads below it.
const MAX_BYTES = 4 * 1024 * 1024
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })

  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Use a JPG, PNG, WebP or AVIF image.' }, { status: 400 })
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: 'Image is over 4 MB — compress it and try again.' }, { status: 400 })

  // Name comes from the MIME type + a random id, never from the uploaded filename.
  const path = `products/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`
  const { error } = await supabaseAdmin.storage
    .from('media')
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) {
    console.error('upload failed', error)
    return NextResponse.json({ error: 'Upload failed. Check the "media" bucket exists and is public.' }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from('media').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
