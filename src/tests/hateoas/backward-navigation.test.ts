import request from 'supertest'
import app from '../../app'

describe('HATEOAS Backward Navigation', () => {
  const testCompany = '001'
  const testTract = 'BÄVERN'

  it('should navigate from residence back to building and property', async () => {
    // Get properties for the test company
    const propertiesResponse = await request(app.callback())
      .get('/properties')
      .query({ companyCode: testCompany, tract: testTract })

    const property = propertiesResponse.body.content[0]

    // Get buildings for the property
    const buildingsResponse = await request(app.callback())
      .get('/buildings')
      .query({ propertyCode: property.code })

    const building = buildingsResponse.body.content[0]

    // Get residences for the building
    const residencesResponse = await request(app.callback())
      .get('/residences')
      .query({ buildingCode: building.code })

    if (residencesResponse.body.content?.length > 0) {
      const residence = residencesResponse.body.content[0]
      expect(residence._links.parent).toBeDefined()

      // Navigate back to building
      const parentBuildingUrl = residence._links.parent.href
      const parentBuildingResponse = await request(app.callback()).get(parentBuildingUrl)
      expect(parentBuildingResponse.status).toBe(200)

      const parentBuilding = parentBuildingResponse.body.content
      expect(parentBuilding._links.parent).toBeDefined()

      // Navigate back to property
      const parentPropertyUrl = parentBuilding._links.parent.href
      const parentPropertyResponse = await request(app.callback()).get(parentPropertyUrl)
      expect(parentPropertyResponse.status).toBe(200)
    }
  })
})
