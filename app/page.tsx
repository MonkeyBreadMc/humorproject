import { supabase } from '@/lib/supabase'

export default async function ExperiencesPage() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error.message}</p>
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Student Experiences</h1>
      <p>{data?.length} experiences loaded</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.map((row) => (
          <li key={row.id} style={{
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <p style={{ margin: 0 }}>{row.description}</p>
            <small style={{ color: '#999' }}>
              #{row.id} · {new Date(row.created_at).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </main>
  )
}