import request from 'supertest'
import app from '../app'

describe('Health Check', () => {
  it('should return healthy status when database is connected', async () => {
    const response = await request(app.callback()).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('healthy')
  })

  it('should include VPN message when database connection fails', async () => {
    // Mock PrismaClient to simulate connection failure
    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockImplementation(() => ({
        $connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
        $disconnect: jest.fn(),
      })),
    }))

    const response = await request(app.callback()).get('/health')
    expect(response.status).toBe(500)
    expect(response.body.status).toBe('unhealthy')
    expect(response.body.message).toBe('Do you have the VPN running?')
  })
})
