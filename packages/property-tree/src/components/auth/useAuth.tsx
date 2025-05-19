import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
  handleCallback: (code: string, redirectUri?: string) => Promise<void>
}

interface AuthConfig {
  keycloakUrl: string
  clientId: string
  apiUrl?: string
  redirectUri?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config: AuthConfig
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const redirectUri = config.redirectUri || `${window.location.origin}/callback`
  const apiUrl = config.apiUrl || '/api'

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/user`, {
          credentials: 'include',
        })
        
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [apiUrl])

  const login = () => {
    const authUrl = new URL(`${config.keycloakUrl}/protocol/openid-connect/auth`)
    authUrl.searchParams.append('client_id', config.clientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', 'openid profile email')
    
    window.location.href = authUrl.toString()
  }

  const handleCallback = async (code: string, customRedirectUri?: string) => {
    const response = await fetch(`${apiUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: customRedirectUri || redirectUri,
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const userData = await response.json()
    setUser(userData)
  }

  const logout = async () => {
    await fetch(`${apiUrl}/logout`, {
      credentials: 'include',
    })
    setUser(null)
    
    // Redirect to Keycloak logout
    const logoutUrl = new URL(`${config.keycloakUrl}/protocol/openid-connect/logout`)
    logoutUrl.searchParams.append('client_id', config.clientId)
    logoutUrl.searchParams.append('redirect_uri', window.location.origin)
    
    window.location.href = logoutUrl.toString()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
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

export function ProtectedRoute({
  children,
  redirectTo = '/',
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const { user, loading, login } = useAuth()
  const [redirected, setRedirected] = React.useState(false)

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Laddar...</div>
  }

  if (!user && !redirected) {
    setRedirected(true)
    login()
    return <div className="flex items-center justify-center h-screen">Omdirigerar till inloggning...</div>
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Omdirigerar till inloggning...</div>
  }

  return <>{children}</>
}
