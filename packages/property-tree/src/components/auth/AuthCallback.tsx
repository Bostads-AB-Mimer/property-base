import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface AuthConfig {
  apiUrl: string
  redirectUri: string
}

function relayAuthCallback(params: {
  apiUrl: string
  redirectUri: string
  code: string
}) {
  return fetch(`${params.apiUrl}/auth/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: params.code,
      redirectUri: params.redirectUri,
    }),
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('auth callback failed')
      }

      return res.json()
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export function AuthCallback({ config }: { config: AuthConfig }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const { apiUrl, redirectUri } = config

  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      console.log('relaying auth callback')
      relayAuthCallback({
        apiUrl,
        redirectUri,
        code,
      })
        .then(() => navigate('/'))
        .catch((err) => {
          console.error(err)
          setError('Ett fel uppstod vid autentisering.')
        })
    } else {
      setError('Ingen autentiseringskod hittades i URL:en.')
    }

    return () => {
      console.log('aborting auth callback')
    }
  }, [code, apiUrl, redirectUri, navigate])

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
