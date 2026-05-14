import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hello World</h1>
      <Link href="/experiences">View Student Experiences</Link>
    </main>
  )
}