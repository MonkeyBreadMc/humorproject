'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient()
  const origin = (await headers()).get('origin')

  if (!origin) {
    throw new Error('Missing request origin for OAuth redirect.')
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/experiences')
}

export async function rateCaption(formData: FormData) {
  const captionId = formData.get('captionId')
  const voteValue = Number(formData.get('voteValue'))

  if (typeof captionId !== 'string' || !captionId) {
    throw new Error('Missing caption id.')
  }

  if (voteValue !== 1 && voteValue !== -1) {
    throw new Error('Vote must be an upvote or downvote.')
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/captions')
  }

  const { error } = await supabase.from('caption_votes').insert({
    caption_id: captionId,
    vote_value: voteValue,
    profile_id: user.id,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
    is_from_study: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/captions')
  redirect('/captions')
}
