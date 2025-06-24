import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { authConfig } from '@/auth-config'
import { POST } from '@/services/api/core/base-api'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = React.useState<string | null>(null)

  const code = searchParams.get('code')

  React.useEffect(() => {
    if (!code) {
      return setError('Ingen autentiseringskod hittades i URL:en.')
    } else {
      POST('/auth/callback', {
        credentials: 'include',
        body: {
          code,
          redirectUri: authConfig.redirectUri,
        },
      })
        .then(() => navigate('/'))
        .catch((err) => {
          console.error(err)
          setError('Ett fel uppstod vid autentisering.')
        })
    }
  }, [code, navigate])

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
