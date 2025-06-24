import { authConfig } from '@/auth-config'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { match, P } from 'ts-pattern'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

type UserState =
  | { tag: 'loading' }
  | { tag: 'error'; error: 'unauthenticated' | 'unknown' }
  | { tag: 'success'; user: User }

export function useUser() {
  const q = useQuery<User, 'unauthenticated' | 'unknown'>({
    queryKey: ['auth', 'user'],
    retry: false,
    staleTime: 500,
    queryFn: () =>
      fetch(`${authConfig.apiUrl}/auth/profile`, {
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw 'unauthenticated'
          } else {
            throw 'unknown'
          }
        }

        return res.json()
      }),
  })

  return match(q)
    .returnType<UserState>()
    .with({ isLoading: true }, () => ({ tag: 'loading' }))
    .with(
      { data: P.not(P.nullish), isLoading: false, isError: false },
      (v) => ({
        tag: 'success',
        user: v.data,
      })
    )
    .with({ error: 'unauthenticated', isLoading: false }, () => ({
      tag: 'error',
      error: 'unauthenticated',
    }))
    .with({ error: 'unknown', isLoading: false }, () => ({
      tag: 'error',
      error: 'unknown',
    }))
    .otherwise(() => ({ tag: 'loading' }))
}

export function useAuth() {
  const login = () => {
    const authUrl = new URL(
      `${authConfig.keycloakUrl}/protocol/openid-connect/auth`
    )
    authUrl.searchParams.append('client_id', authConfig.clientId)
    authUrl.searchParams.append('redirect_uri', authConfig.redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', 'openid profile email')

    window.location.href = authUrl.toString()
  }

  const logout = () => {
    const logoutUrl = new URL(`${authConfig.apiUrl}/auth/logout`)
    window.location.href = logoutUrl.toString()
  }

  return {
    login,
    logout,
  }
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { login } = useAuth()
  const user = useUser()

  React.useEffect(() => {
    if (user.tag === 'error' && user.error === 'unauthenticated') {
      login()
    }
  }, [login, user])

  return match(user)
    .with({ tag: 'loading' }, () => (
      <div className="flex items-center justify-center h-screen">Laddar...</div>
    ))
    .with({ tag: 'error' }, (e) => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Okänt fel, kontakta support."</div>
      </div>
    ))
    .with({ tag: 'success' }, () => <>{children}</>)
    .exhaustive()
}
