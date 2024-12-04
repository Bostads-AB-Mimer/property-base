import request from 'supertest'
import app from '../app'

describe('API Navigation Tests', () => {
  it('should get properties list filtered by tract', async () => {
    const testTract = 'BÄVERN'
    const response = await request(app.callback())
      .get(`/properties/?tract=${testTract}`)
      .expect(200)

    expect(response.body.content).toBeDefined()
    expect(Array.isArray(response.body.content)).toBe(true)
    expect(response.body.content.length).toBeGreaterThan(0)

    // Check that _links are present in the response
    expect(response.body._links).toBeDefined()
    expect(response.body._links.self).toBeDefined()
    expect(response.body._links.self.href).toBeDefined()

    // Verify property structure
    expect(response.body.content.length).toBeGreaterThanOrEqual(0)
    if (response.body.content.length > 0) {
      const property = response.body.content[0]
      expect(property.id).toBeDefined()
      expect(property.code).toBeDefined()
      expect(property.tract).toBe(testTract)
    }
  })

  it('should get detailed property information by ID', async () => {
    const testTract = 'BÄVERN'
    const propertiesResponse = await request(app.callback())
      .get(`/properties/?tract=${testTract}`)
      .expect(200)
    
    const property = propertiesResponse.body.content[0]

    const propertyDetailsResponse = await request(app.callback())
      .get(`/properties/${property.id}/`)
      .expect(200)

    expect(propertyDetailsResponse.body.content).toBeDefined()

    // Verify property details structure
    const propertyDetails = propertyDetailsResponse.body.content
    expect(propertyDetails.id).toBe(property.id)
    expect(propertyDetails.code).toBe(property.code)
    expect(propertyDetails.tract).toBe(testTract)

    // Verify HATEOAS links are present
    expect(propertyDetailsResponse.body._links).toBeDefined()
    expect(propertyDetailsResponse.body._links.self).toBeDefined()
    expect(propertyDetailsResponse.body._links.self.href).toBeDefined()
  })

  it('should get residences associated with a property', async () => {
    const testTract = 'BÄVERN'
    // First get properties in the test tract
    const propertiesResponse = await request(app.callback())
      .get(`/properties/?tract=${testTract}`)
      .expect(200)
    
    const property = propertiesResponse.body.content[0]

    // Then get residences for the first property
    const residencesResponse = await request(app.callback())
      .get(`/residences/?propertyCode=${property.propertyCode}`)
      .expect(200)

    expect(residencesResponse.body.content).toBeDefined()
    expect(Array.isArray(residencesResponse.body.content)).toBe(true)

    // Verify residence structure if any exist
    if (residencesResponse.body.content.length > 0) {
      const residence = residencesResponse.body.content[0]
      expect(residence.id).toBeDefined()
      expect(residence.code).toBeDefined()
      expect(residence.name).toBeDefined()
      expect(residence._links).toBeDefined()
      expect(residence._links.property.href).toBe(`/properties/${property.propertyCode || ''}`)
    }
  })

  it('should get buildings associated with a property', async () => {
    const testTract = 'BÄVERN'
    const propertiesResponse = await request(app.callback())
      .get(`/properties/?tract=${testTract}`)
      .expect(200)
    
    const property = propertiesResponse.body.content[0]
    const buildingsLink = `/buildings/${property.code}/`

    const buildingsResponse = await request(app.callback())
      .get(buildingsLink)
      .expect(200)

    expect(buildingsResponse.body.content).toBeDefined()
  })
})
