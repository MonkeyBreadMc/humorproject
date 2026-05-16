import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

const API_BASE_URL = 'https://api.almostcrackd.ai'
const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
])

type PresignedResponse = {
  presignedUrl: string
  cdnUrl: string
}

type UploadImageResponse = {
  imageId: string
}

async function postJson<T>(path: string, accessToken: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const payload = await response.json()

  if (!response.ok) {
    const message = payload?.message ?? payload?.error ?? `${path} failed with status ${response.status}.`
    throw new Error(message)
  }

  return payload as T
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return NextResponse.json({ error: 'You must be signed in to generate captions.' }, { status: 401 })
  }

  const formData = await request.formData()
  const image = formData.get('image')

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: 'Upload an image first.' }, { status: 400 })
  }

  if (!SUPPORTED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json({ error: 'Use a jpeg, png, webp, gif, or heic image.' }, { status: 400 })
  }

  try {
    const presigned = await postJson<PresignedResponse>(
      '/pipeline/generate-presigned-url',
      session.access_token,
      { contentType: image.type }
    )

    const uploadResponse = await fetch(presigned.presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Image upload failed with status ${uploadResponse.status}.`)
    }

    const registeredImage = await postJson<UploadImageResponse>(
      '/pipeline/upload-image-from-url',
      session.access_token,
      {
        imageUrl: presigned.cdnUrl,
        isCommonUse: false,
      }
    )

    const captions = await postJson<unknown[]>(
      '/pipeline/generate-captions',
      session.access_token,
      { imageId: registeredImage.imageId }
    )

    return NextResponse.json({
      captions,
      imageId: registeredImage.imageId,
      imageUrl: presigned.cdnUrl,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Caption generation failed.' },
      { status: 502 }
    )
  }
}
