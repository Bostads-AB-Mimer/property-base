import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './useAuth'

export function Callback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleCallback } = useAuth()
  
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      handleCallback(code)
        .then(() => navigate('/'))
        .catch(err => console.error(err))
    }
  }, [handleCallback, navigate, searchParams])
  
  return <div className="flex items-center justify-center h-screen">Autentiserar...</div>
}
