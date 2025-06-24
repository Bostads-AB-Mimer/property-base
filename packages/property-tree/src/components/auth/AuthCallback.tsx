import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './useAuth'

export function AuthCallback({ authConfig }: { authConfig: AuthConfig }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const { handleCallback } = useAuth()

  useEffect(() => {
    console.log('rendering auth callback')
    const code = searchParams.get('code')

    if (code) {
      handleCallback(code).then(() => navigate('/'))
    } else {
      setError('Ingen autentiseringskod hittades i URL:en.')
    }
  }, [handleCallback, navigate, searchParams])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Gå tillbaka
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen">
      Autentiserar...
    </div>
  )
}
