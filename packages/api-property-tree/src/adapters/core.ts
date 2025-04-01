import axios from 'axios'
import { config } from '../config'

interface CoreAuthResponse {
  token: string
}

let token: string | null = null

type Params = {
  refresh: boolean
}

export async function getCoreBearerToken(
  params: Params = { refresh: false },
): Promise<string> {
  if (token && !params.refresh) {
    return token
  }

  try {
    const response = await axios.post<CoreAuthResponse>(
      `${config.CORE__API_URL}/auth/generatetoken`,
      { username: config.CORE__USERNAME, password: config.CORE__PASSWORD },
    )

    token = response.data.token

    return token
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to get Core API token: ${error.response?.data?.message || error.message}`,
      )
    }
    throw error
  }
}
