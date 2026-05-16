'use client'

import { useState } from 'react'

type CaptionRecord = {
  id?: string | number
  content?: string
  caption?: string
  text?: string
}

type GenerateResult = {
  captions?: CaptionRecord[]
  error?: string
}

function captionText(caption: CaptionRecord) {
  return caption.content ?? caption.caption ?? caption.text ?? JSON.stringify(caption)
}

export function CaptionGenerator() {
  const [captions, setCaptions] = useState<CaptionRecord[]>([])
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    setCaptions([])

    try {
      const image = formData.get('image')
      if (image instanceof File) {
        setPreviewUrl(URL.createObjectURL(image))
      }

      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        body: formData,
      })
      const text = await response.text()
      const result = text ? JSON.parse(text) as GenerateResult : {}

      if (!response.ok) {
        setError(result.error ?? 'Caption generation failed.')
        return
      }

      setCaptions(result.captions ?? [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Caption generation failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1.25rem',
      background: '#f9f9f9',
    }}>
      <form action={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
          name="image"
          required
          type="file"
        />
        <button
          disabled={isLoading}
          type="submit"
          style={{
            background: isLoading ? '#777' : '#111',
            border: 0,
            borderRadius: '6px',
            color: '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            padding: '0.75rem 1rem',
            width: 'fit-content',
          }}
        >
          {isLoading ? 'Generating...' : 'Generate captions'}
        </button>
      </form>

      {previewUrl ? (
        <img
          alt="Uploaded preview"
          src={previewUrl}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            display: 'block',
            marginTop: '1.25rem',
            maxHeight: '320px',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      ) : null}

      {error ? (
        <p style={{ color: '#b00020', marginTop: '1rem' }}>{error}</p>
      ) : null}

      {captions.length > 0 ? (
        <div style={{ marginTop: '1.25rem' }}>
          <h2>Generated Captions</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {captions.map((caption, index) => (
              <li
                key={`${caption.id ?? index}`}
                style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                  padding: '1rem',
                }}
              >
                {captionText(caption)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
