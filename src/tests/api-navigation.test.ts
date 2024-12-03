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

  it('should get properties list filtered by tract', async () => {
    const testTract = 'BÄVERN'
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/?tract=${testTract}`
    )
    expect(propertiesResponse.status).toBe(200)
    expect(propertiesResponse.data.content).toBeDefined()
    expect(Array.isArray(propertiesResponse.data.content)).toBe(true)
    expect(propertiesResponse.data.content.length).toBeGreaterThan(0)

    // Check that _links are present in the response
    expect(propertiesResponse.data._links).toBeDefined()
    expect(propertiesResponse.data._links.self).toBeDefined()
    expect(propertiesResponse.data._links.self.href).toBeDefined()

    // Verify property structure
    expect(propertiesResponse.data.content).toHaveLength(1)
    const property = propertiesResponse.data.content[0]
    expect(property.id).toBeDefined()
    expect(property.code).toBeDefined()
    expect(property.tract).toBe(testTract)
  })

  it('should get detailed property information by ID', async () => {
    const testTract = 'BÄVERN'
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/?tract=${testTract}`
    )
    const property = propertiesResponse.data.content[0]

    const propertyDetailsResponse = await axios.get(
      `${API_BASE}/properties/${property.propertyId}/`
    )
    expect(propertyDetailsResponse.status).toBe(200)
    expect(propertyDetailsResponse.data.content).toBeDefined()

    // Verify property details structure
    const propertyDetails = propertyDetailsResponse.data.content
    expect(propertyDetails.id).toBe(property.id)
    expect(propertyDetails.code).toBe(property.code)
    expect(propertyDetails.tract).toBe(testTract)

    // Verify HATEOAS links are present
    expect(propertyDetailsResponse.data._links).toBeDefined()
    expect(propertyDetailsResponse.data._links.self).toBeDefined()
    expect(propertyDetailsResponse.data._links.self.href).toBeDefined()
  })

  it('should get residences associated with a property', async () => {
    const testTract = 'BÄVERN'
    // First get properties in the test tract
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/?tract=${testTract}`
    )
    const property = propertiesResponse.data.content[0]

    // Then get residences for the first property
    const residencesResponse = await axios.get(
      `${API_BASE}/residences/?propertyCode=${property.propertyCode}`
    )
    expect(residencesResponse.status).toBe(200)
    expect(residencesResponse.data.content).toBeDefined()
    expect(Array.isArray(residencesResponse.data.content)).toBe(true)

    // Verify residence structure if any exist
    if (residencesResponse.data.content.length > 0) {
      const residence = residencesResponse.data.content[0]
      expect(residence.id).toBeDefined()
      expect(residence.code).toBeDefined()
      expect(residence.name).toBeDefined()
      expect(residence._links).toBeDefined()
      expect(residence.propertyObject?.property?.code).toBe(property.code)
    }
  })

  it('should get buildings associated with a property', async () => {
    const testTract = 'BÄVERN'
    const propertiesResponse = await axios.get(
      `${API_BASE}/properties/?tract=${testTract}`
    )
    const property = propertiesResponse.data.content[0]

    const propertyDetailsResponse = await axios.get(
      `${API_BASE}/properties/${property.propertyId}/`
    )
    const propertyDetails = propertyDetailsResponse.data.content

    if (propertyDetails.code) {
      const buildingsLink = `/buildings/${propertyDetails.code}/`
      const buildingsResponse = await axios.get(`${API_BASE}${buildingsLink}`)
      expect(buildingsResponse.status).toBe(200)
      expect(buildingsResponse.data.content).toBeDefined()
    }
  })
})
