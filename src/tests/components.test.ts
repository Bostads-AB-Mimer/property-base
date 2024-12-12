import request from 'supertest'
import app from '../app'

describe('Components API', () => {
  const testMaintenanceUnit = 'TEST001' // Replace with a valid maintenance unit code

  it('should return components for a maintenance unit', async () => {
    const response = await request(app.callback())
      .get('/components')
      .query({ maintenanceUnit: testMaintenanceUnit })
    
    expect(response.status).toBe(200)
    expect(response.body.content).toBeDefined()
    expect(Array.isArray(response.body.content)).toBe(true)

    if (response.body.content.length > 0) {
      const component = response.body.content[0]
      expect(component.id).toBeDefined()
      expect(component.code).toBeDefined()
      expect(component.name).toBeDefined()
      expect(component.details).toBeDefined()
      expect(component.classification).toBeDefined()
      expect(component._links).toBeDefined()
      expect(component._links.self).toBeDefined()
      expect(component._links.maintenanceUnit).toBeDefined()
    }
  })

  it('should validate maintenanceUnit parameter', async () => {
    const response = await request(app.callback())
      .get('/components')
      .query({ maintenanceUnit: '' }) // Empty maintenance unit code
    
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
  })
})
