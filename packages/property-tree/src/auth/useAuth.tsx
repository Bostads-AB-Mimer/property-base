import { authConfig } from '@/auth-config'

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
