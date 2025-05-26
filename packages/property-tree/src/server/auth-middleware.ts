import { Request, Response, NextFunction } from 'express'

interface TokenResponse {
  access_token: string
  refresh_token: string
  id_token: string
  expires_in: number
}

interface UserInfo {
  sub: string
  name: string
  email: string
  preferred_username: string
  given_name: string
  family_name: string
}

export function createAuthMiddleware(config: {
  keycloakUrl: string
  clientId: string
  clientSecret: string
}) {
  return {
    // Middleware to handle token exchange
    tokenHandler: async (req: Request, res: Response) => {
      const { code, redirect_uri } = req.body

      if (!code || !redirect_uri) {
        return res.status(400).json({ error: 'Missing code or redirect_uri' })
      }

      try {
        const tokenUrl = `${config.keycloakUrl}/protocol/openid-connect/token`
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri,
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error('Token exchange failed:', error)
          return res
            .status(response.status)
            .json({ error: 'Token exchange failed' })
        }

        const tokenData = (await response.json()) as TokenResponse

        // Set tokens in cookies
        res.cookie('access_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: tokenData.expires_in * 1000,
        })

        res.cookie('refresh_token', tokenData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })

        // Get user info
        const userInfoUrl = `${config.keycloakUrl}/protocol/openid-connect/userinfo`
        const userInfoResponse = await fetch(userInfoUrl, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        })

        if (!userInfoResponse.ok) {
          return res
            .status(userInfoResponse.status)
            .json({ error: 'Failed to get user info' })
        }

        const userInfo = (await userInfoResponse.json()) as UserInfo

        // Return user data to client
        return res.json({
          id: userInfo.sub,
          name:
            userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`,
          email: userInfo.email,
          username: userInfo.preferred_username,
          roles: [], // You would extract roles from the token if needed
        })
      } catch (error) {
        console.error('Auth error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }
    },

    // Middleware to get current user
    userHandler: async (req: Request, res: Response) => {
      const accessToken = req.cookies.access_token

      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      try {
        const userInfoUrl = `${config.keycloakUrl}/protocol/openid-connect/userinfo`
        const userInfoResponse = await fetch(userInfoUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!userInfoResponse.ok) {
          return res.status(401).json({ error: 'Invalid token' })
        }

        const userInfo = (await userInfoResponse.json()) as UserInfo

        return res.json({
          id: userInfo.sub,
          name:
            userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`,
          email: userInfo.email,
          username: userInfo.preferred_username,
          roles: [], // You would extract roles from the token if needed
        })
      } catch (error) {
        console.error('User info error:', error)
        return res.status(500).json({ error: 'Internal server error' })
      }
    },

    // Middleware to logout
    logoutHandler: (req: Request, res: Response) => {
      res.clearCookie('access_token')
      res.clearCookie('refresh_token')
      return res.json({ success: true })
    },

    // Middleware to protect API routes
    protect: (req: Request, res: Response, next: NextFunction) => {
      const accessToken = req.cookies.access_token

      if (!accessToken) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Here you would validate the token
      // For simplicity, we're just checking if it exists
      // In a real app, you'd verify the token signature and expiration

      next()
    },
  }
}
