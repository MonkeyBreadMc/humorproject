import { rateCaption, signInWithGoogle, signOut } from '@/app/actions'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

type Caption = {
  id: string
  content: string
  like_count: number | null
  created_datetime_utc: string
}

export default async function CaptionsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#555' }}>Back home</Link>
        <h1>Rate Captions</h1>
        <section style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          background: '#f9f9f9',
        }}>
          <h2 style={{ marginTop: 0 }}>Sign in required</h2>
          <p style={{ color: '#555', lineHeight: 1.5 }}>
            You must be logged in before you can rate captions.
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

  const { data, error } = await supabase
    .from('captions')
    .select('id, content, like_count, created_datetime_utc')
    .order('created_datetime_utc', { ascending: false })
    .limit(20)
    .returns<Caption[]>()

  if (error) {
    return <p style={{ color: 'red', fontFamily: 'sans-serif' }}>Error: {error.message}</p>
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <Link href="/" style={{ color: '#555' }}>Back home</Link>
          <h1 style={{ marginBottom: '0.25rem' }}>Rate Captions</h1>
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

      <p>{data?.length ?? 0} captions loaded</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((caption) => (
          <li key={caption.id} style={{
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ marginTop: 0, fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.45 }}>
              {caption.content}
            </p>
            <p style={{ color: '#777', margin: '0 0 1rem' }}>
              Current like count: {caption.like_count ?? 0}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <form action={rateCaption}>
                <input type="hidden" name="captionId" value={caption.id} />
                <input type="hidden" name="voteValue" value="1" />
                <button type="submit" style={{
                  background: '#111',
                  border: 0,
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  padding: '0.6rem 0.9rem',
                }}>
                  Upvote
                </button>
              </form>
              <form action={rateCaption}>
                <input type="hidden" name="captionId" value={caption.id} />
                <input type="hidden" name="voteValue" value="-1" />
                <button type="submit" style={{
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  color: '#111',
                  cursor: 'pointer',
                  fontWeight: 700,
                  padding: '0.6rem 0.9rem',
                }}>
                  Downvote
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
