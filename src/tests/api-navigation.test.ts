import axios from 'axios'
import app from '../app'
const TEST_PORT = 5051
const API_BASE = `http://localhost:${TEST_PORT}`
let server: any

describe('API Navigation Tests', () => {
  beforeAll(async () => {
    server = app.listen(TEST_PORT)
  })

  afterAll(async () => {
    server.close()
  })

  it('should get companies', async () => {
    const companyResponse = await axios.get(`${API_BASE}/companies/`)
    expect(companyResponse.status).toBe(200)
    expect(companyResponse.data.content).toBeDefined()
    expect(Array.isArray(companyResponse.data.content)).toBe(true)
    expect(companyResponse.data.content.length).toBeGreaterThan(0)

    // Check that _links are present in the response
    expect(companyResponse.data._links).toBeDefined()
    expect(companyResponse.data._links.self).toBeDefined()
    expect(companyResponse.data._links.self.href).toBeDefined()

    // Verify company structure
    const company = companyResponse.data.content[0]
    expect(company.id).toBeDefined()
    expect(company.propertyObjectId).toBeDefined()
    expect(company.code).toBeDefined()
    expect(company.name).toBeDefined()
    expect(company.organizationNumber).toBeDefined()
  })

  it('should get properties list filtered by tract', async () => {
    const testCompany = '001'
    const testTract = 'BÄVERN'
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/${testCompany}?tract=${testTract}`
    )
    expect(propertiesResponse.status).toBe(200)
    expect(propertiesResponse.data.content).toBeDefined()
    expect(Array.isArray(propertiesResponse.data.content)).toBe(true)
    expect(propertiesResponse.data.content.length).toBeGreaterThan(0)

    // Check that _links are present in the response
    expect(response.body._links).toBeDefined()
    expect(response.body._links.self).toBeDefined()
    expect(response.body._links.self.href).toBeDefined()

    // Verify property structure
    const property = propertiesResponse.data.content[0]
    expect(property.propertyId).toBeDefined()
    expect(property.code).toBeDefined()
    expect(property.name).toContain(testTract)
  })

  it('should get detailed property information by ID', async () => {
    const testCompany = '001'
    const testTract = 'BÄVERN'
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/${testCompany}?tract=${testTract}`
    )
    const property = propertiesResponse.data.content[0]

    const propertyDetailsResponse = await axios.get(
      `${API_BASE}/properties/Id/${property.propertyId}/`
    )
    expect(propertyDetailsResponse.status).toBe(200)
    expect(propertyDetailsResponse.data.content).toBeDefined()

    // Verify property details structure
    const propertyDetails = propertyDetailsResponse.data.content
    expect(propertyDetails.propertyObjectId).toBe(property.propertyId)
    expect(propertyDetails.propertyCode).toBe(property.propertyCode)
    expect(propertyDetails.tract).toBe(testTract)

    // Verify HATEOAS links are present
    expect(propertyDetailsResponse.body._links).toBeDefined()
    expect(propertyDetailsResponse.body._links.self).toBeDefined()
    expect(propertyDetailsResponse.body._links.self.href).toBeDefined()
  })

  //todo: add test for staircases before residence test

  it('should get residences associated with a property', async () => {
    //todo: this test will fail due to links not being present in the response
    //todo: it should also either use /residences/buildingCode/<val> or /residences/buildingCode/<val>/staircase/<val>
    const testCompany = '001'
    const testTract = 'BÄVERN'
    // First get properties in the test tract
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/${testCompany}?tract=${testTract}`
    )

    const property = propertiesResponse.data.content[0]

    // Then get residences for the first property
    const residencesResponse = await request(app.callback())
      .get(`/residences/?propertyCode=${property.code}`)
      .expect(200)

    expect(residencesResponse.body.content).toBeDefined()
    expect(Array.isArray(residencesResponse.body.content)).toBe(true)

    // Verify residence structure if any exist
    if (residencesResponse.body.content.length > 0) {
      const residence = residencesResponse.body.content[0]
      expect(residence.id).toBeDefined()
      expect(residence.code).toBeDefined()
      expect(residence.name).toBeDefined()
    }
  })

  it('should get buildings associated with a property', async () => {
    const testCompany = '001'
    const testTract = 'BÄVERN'
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/${testCompany}?tract=${testTract}`
    )
    const property = propertiesResponse.data.content[0]

    const propertyDetailsResponse = await axios.get(
      `${API_BASE}/properties/Id/${property.propertyId}/`
    )
    const propertyDetails = propertyDetailsResponse.data.content

    if (propertyDetails.propertyCode) {
      const buildingsLink = `/buildings/${propertyDetails.propertyCode}/`
      const buildingsResponse = await axios.get(`${API_BASE}${buildingsLink}`)
      expect(buildingsResponse.status).toBe(200)
      expect(buildingsResponse.data.content).toBeDefined()
    }
  })
})
