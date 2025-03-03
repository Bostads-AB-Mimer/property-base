import createClient from 'openapi-fetch'
import type { paths } from './generated/api-types' // autogenerated in package.json

// Always use /api path which will be:
// - In production: proxied by nginx to property-base service
// - In development: proxied by Vite to the backend URL specified in vite.config.ts
const API_BASE_URL = '/api'

export const { GET, POST, PUT, DELETE, PATCH } = createClient<paths>({
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
