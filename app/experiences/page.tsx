import { supabase } from '@/lib/supabase'

export default async function ExperiencesPage() {
  const { data, error } = await supabase
    .from('llm_providers')
    .select('*')
    .order('created_datetime_utc', { ascending: false })

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error.message}</p>
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>LLM Providers</h1>
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