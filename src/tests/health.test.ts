import request from 'supertest'
import app from '../api'

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app.callback()).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('healthy')
  })
})
