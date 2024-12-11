import request from 'supertest'
import app from '../app'

describe('API Navigation Tests', () => {
  it('should get companies', async () => {
    const response = await request(app.callback()).get('/companies/')
    expect(response.status).toBe(200)
    expect(response.body.content).toBeDefined()
    expect(Array.isArray(response.body.content)).toBe(true)
    expect(response.body.content.length).toBeGreaterThan(0)

    // Check that _links are present in the response
    expect(response.body._links).toBeDefined()
    expect(response.body._links.self).toBeDefined()
    expect(response.body._links.self.href).toBeDefined()

    // Verify company structure
    const company = response.body.content[0]
    expect(company.id).toBeDefined()
    expect(company.propertyObjectId).toBeDefined()
    expect(company.code).toBeDefined()
    expect(company.name).toBeDefined()
    expect(company.organizationNumber).toBeDefined()
  })

  it('should get properties list filtered by tract', async () => {
    const testCompany = '001'
    const testTract = 'BÄVERN'
    const response = await request(app.callback())
      .get(`/properties`)
      .query({ companyCode: testCompany, tract: testTract })
    
    expect(response.status).toBe(200)
    expect(response.body.content).toBeDefined()
    expect(Array.isArray(response.body.content)).toBe(true)
    expect(response.body.content.length).toBeGreaterThan(0)

    // Check that _links are present in the response
    expect(response.body._links).toBeDefined()
    expect(response.body._links.self).toBeDefined()
    expect(response.body._links.self.href).toBeDefined()

    // Verify property structure
    const property = response.body.content[0]
    expect(property.propertyId).toBeDefined()
    expect(property.code).toBeDefined()
    expect(property.name).toContain(testTract)
  })

  it('should get detailed property information by ID', async () => {
    // First get a property ID from the list
    const testCompanyId = '001'
    const propertiesResponse = await request(app.callback())
      .get('/properties')
      .query({ companyCode: testCompanyId })
    
    const property = propertiesResponse.body.content[0]
    
    // Then get the details for that property
    const response = await request(app.callback())
      .get(`/properties/${property.propertyId}`)
    
    expect(response.status).toBe(200)
    expect(response.body.content).toBeDefined()

    // Verify property details structure
    const propertyDetails = response.body.content
    expect(propertyDetails.propertyObjectId).toBe(property.propertyId)
    expect(propertyDetails.code).toBe(property.code)

    // Verify HATEOAS links are present
    expect(response.body._links).toBeDefined()
    expect(response.body._links.self).toBeDefined()
    expect(response.body._links.self.href).toBeDefined()
  })

  it('should get buildings associated with a property', async () => {
    // First get a property
    const testCompany = '001'
    const testTract = 'BÄVERN'
    const propertiesResponse = await request(app.callback())
      .get('/properties')
      .query({ companyCode: testCompany, tract: testTract })
    
    const property = propertiesResponse.body.content[0]

    const propertyDetailsResponse = await request(app.callback())
      .get(`/properties/${property.propertyId}`)
    
    const propertyDetails = propertyDetailsResponse.body.content

    if (propertyDetails.code) {
      const response = await request(app.callback())
        .get('/buildings')
        .query({ propertyCode: propertyDetails.code })
      
      expect(response.status).toBe(200)
      expect(response.body.content).toBeDefined()
    }
  })

  it('should get residences associated with a property', async () => {
    // First get a property
    const testCompany = '001'
    const testTract = 'BÄVERN'
    const propertiesResponse = await request(app.callback())
      .get('/properties')
      .query({ companyCode: testCompany, tract: testTract })
    
    const property = propertiesResponse.body.content[0]

    // Get property details
    const propertyDetailsResponse = await request(app.callback())
      .get(`/properties/${property.propertyId}`)
    
    const propertyDetails = propertyDetailsResponse.body.content

    // Get buildings
    const buildingsResponse = await request(app.callback())
      .get('/buildings')
      .query({ propertyCode: propertyDetails.code })

    const building = buildingsResponse.body.content[0]

    // Then get residences for the first building
    const response = await request(app.callback())
      .get('/residences')
      .query({ buildingCode: building.code })
    
    expect(response.status).toBe(200)
    expect(response.body.content).toBeDefined()
    expect(Array.isArray(response.body.content)).toBe(true)

    // Verify residence structure if any exist
    if (response.body.content.length > 0) {
      const residence = response.body.content[0]
      expect(residence.id).toBeDefined()
      expect(residence.code).toBeDefined()
      expect(residence.name).toBeDefined()
    }
  })
})
