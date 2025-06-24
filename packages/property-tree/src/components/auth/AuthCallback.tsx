import { POST } from '@/services/api/core/base-api'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function relayAuthCallback(params: { redirectUri: string; code: string }) {
  return POST('/auth/callback', {
    credentials: 'include',
    body: {
      code: params.code,
      redirectUri: params.redirectUri,
    },
  })
}

interface Props {
  config: {
    apiUrl: string
    redirectUri: string
  }
}

export function AuthCallback({ config }: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const { apiUrl, redirectUri } = config

  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      relayAuthCallback({
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
