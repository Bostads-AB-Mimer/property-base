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
    fetch(`${apiUrl}/user`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Not authenticated')
      })
      .then((userData) => {
        setUser(userData)
      })
      .catch(() => {
        // User is not authenticated, that's okay
      })
      .finally(() => {
        setLoading(false)
      })
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
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Laddar...</div>
  }

  if (!user) {
    window.location.href = redirectTo
    return null
  }

  return <>{children}</>
}
