import { signInWithGoogle, signOut } from '@/app/actions'
import { CaptionGenerator } from '@/app/generate/CaptionGenerator'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function GeneratePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#555' }}>Back home</Link>
        <h1>Generate Captions</h1>
        <section style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          background: '#f9f9f9',
        }}>
          <h2 style={{ marginTop: 0 }}>Sign in required</h2>
          <p style={{ color: '#555', lineHeight: 1.5 }}>
            You must be logged in before you can upload an image and generate captions.
          </p>
          <form action={signInWithGoogle}>
            <button type="submit" style={{
              background: '#111',
              border: 0,
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
              padding: '0.75rem 1rem',
            }}>
              Sign in with Google
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <Link href="/" style={{ color: '#555' }}>Back home</Link>
          <h1 style={{ marginBottom: '0.25rem' }}>Generate Captions</h1>
          <p style={{ color: '#666', marginTop: 0 }}>Signed in as {user.email}</p>
        </div>
        <form action={signOut}>
          <button type="submit" style={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            color: '#111',
            cursor: 'pointer',
            fontWeight: 700,
            padding: '0.65rem 0.9rem',
          }}>
            Sign out
          </button>
        </form>
      </div>
      <CaptionGenerator />
    </main>
  )
}
