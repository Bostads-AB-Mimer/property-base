import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { match, P } from 'ts-pattern'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: FooUser
  login: () => void
  logout: () => void
  config: AuthConfig
}

interface AuthConfig {
  keycloakUrl: string
  clientId: string
  apiUrl?: string
  redirectUri?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

type FooUser =
  | { tag: 'loading' }
  | { tag: 'success'; user: User }
  | { tag: 'error'; error: 'unauthenticated' | 'unknown' }

export function useUser(config: AuthConfig) {
  const q = useQuery<User, 'unauthenticated' | 'unknown'>({
    queryKey: ['auth', 'user'],
    retry: false,
    queryFn: () =>
      fetch(`${config.apiUrl}/auth/profile`, {
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
    .returnType<FooUser>()
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

export function AuthProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config: AuthConfig
}) {
  const redirectUri = config.redirectUri || `${window.location.origin}/callback`
  const apiUrl = config.apiUrl || '/api'

  console.log('AuthProvider', { config })
  const login = () => {
    console.log('login', config)
    const authUrl = new URL(
      `${config.keycloakUrl}/protocol/openid-connect/auth`
    )
    authUrl.searchParams.append('client_id', config.clientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', 'openid profile email')

    window.location.href = authUrl.toString()
  }

  const user = useUser(config)

  const logout = async () => {
    const logoutUrl = new URL(`${apiUrl}/auth/logout`)
    window.location.href = logoutUrl.toString()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        config,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, login } = useAuth()

  console.log('rendering protected route', user)

  useEffect(() => {
    if (user.tag === 'error' && user.error === 'unauthenticated') {
      console.log('Protected route: unauthenticated, logging in')
      login()
    }
  }, [login])

  return match(user)
    .with({ tag: 'loading' }, () => (
      <div className="flex items-center justify-center h-screen">Laddar...</div>
    ))
    .with({ tag: 'error' }, (e) => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{e.error}</div>
      </div>
    ))
    .with({ tag: 'success' }, () => <>{children}</>)
    .exhaustive()
}
