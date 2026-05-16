import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hello World</h1>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/experiences">View Student Experiences</Link>
        <Link href="/captions">Rate Captions</Link>
      </nav>
    </main>
  )
}
