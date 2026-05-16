import { signInWithGoogle, signOut } from '@/app/actions'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function ExperiencesPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '720px', margin: '0 auto' }}>
        <h1>LLM Providers</h1>
        <section style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          background: '#f9f9f9',
        }}>
          <h2 style={{ marginTop: 0 }}>Sign in required</h2>
          <p style={{ color: '#555', lineHeight: 1.5 }}>
            This route is protected. Sign in with your Google account to view the provider list.
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
    .from('llm_providers')
    .select('*')
    .order('created_datetime_utc', { ascending: false })

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error.message}</p>
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>LLM Providers</h1>
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
      <p>{data?.length} providers loaded</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((row) => (
          <li key={row.id} style={{
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{row.name}</p>
            <small style={{ color: '#999', display: 'block', marginTop: '0.5rem' }}>
              ID: #{row.id}
            </small>
            <small style={{ color: '#999', display: 'block' }}>
              Created: {new Date(row.created_datetime_utc).toLocaleDateString()}
            </small>
            <small style={{ color: '#999', display: 'block' }}>
              Modified: {new Date(row.modified_datetime_utc).toLocaleDateString()}
            </small>
            <small style={{ color: '#bbb', display: 'block', marginTop: '0.3rem', fontSize: '0.7rem' }}>
              Created by: {row.created_by_user_id}
            </small>
            <small style={{ color: '#bbb', display: 'block', fontSize: '0.7rem' }}>
              Modified by: {row.modified_by_user_id}
            </small>
          </li>
        ))}
      </ul>
    </main>
  )
}
