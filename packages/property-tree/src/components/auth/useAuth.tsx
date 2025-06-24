import React, { createContext, useContext, useEffect, useState } from 'react'
import { match } from 'ts-pattern'

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
  handleCallback: (code: string, customRedirectUri?: string) => Promise<void>
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
  const [user, setUser] = useState<FooUser>({ tag: 'loading' })

  useEffect(() => {
    const abortController = new AbortController()

    const checkAuth = async () => {
      console.log('checking auth')
      try {
        const res = await fetch(`${config.apiUrl}/auth/profile`, {
          credentials: 'include',
          signal: abortController.signal,
        })

        if (res.ok) {
          const userData = await res.json()
          console.log(
            'auth provider, got user data and setting loading false',
            userData
          )
          setUser({ tag: 'success', user: userData })
        } else {
          if (res.status === 401) {
            setUser({ tag: 'error', error: 'unauthenticated' })
          } else {
            setUser({
              tag: 'error',
              error: 'unknown',
            })
          }
        }
      } catch (err) {
        if (err === 'abort-auth-check') {
          console.log('abort-auth-check, ignoring')
        } else {
          setUser({ tag: 'error', error: 'unknown' })
        }
      }
    }

    checkAuth()

    return () => {
      abortController.abort('abort-auth-check')
    }
  }, [config.apiUrl])

  return [user, setUser] as const
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

  const [user, setUser] = useUser(config)

  const handleCallback = React.useCallback(
    async (code: string) => {
      try {
        console.log('doing auth callback', { code })
        setUser({ tag: 'loading' })
        const response = await fetch(`${config.apiUrl}/auth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirectUri: config.redirectUri,
          }),
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('auth callback failed')
          return setUser({ tag: 'error', error: 'unknown' })
        }
        console.log('auth callback success')
        return setUser({ tag: 'success', user: await response.json() })
      } catch (err) {
        console.error(err)
        return setUser({ tag: 'error', error: 'unknown' })
      }
    },
    [config.apiUrl, config.redirectUri, setUser]
  )

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
        handleCallback,
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
  }, [login, user])

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
