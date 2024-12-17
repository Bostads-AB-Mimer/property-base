import request from 'supertest'
import app from '../app'

describe('Components API', () => {
  it('should return components', async () => {
    const buildingsResponse = await request(app.callback())
      .get('/buildings')
      .query({ propertyCode: '01901' })
    const buildingCode = buildingsResponse.body.content[0].code

    const staircaseResponse = await request(app.callback())
      .get('/staircases')
      .query({ buildingCode })
    const floorCode = staircaseResponse.body.content[0].code

    const residencesResponse = await request(app.callback())
      .get('/residences')
      .query({ buildingCode })
    const residence = residencesResponse.body.content[0]
    const residenceCode = residence.code

    const roomsResponse = await request(app.callback())
      .get('/rooms')
      .query({ buildingCode, floorCode, residenceCode })
    const roomCode = roomsResponse.body.content[2].code

    const response = await request(app.callback()).get('/components').query({
      buildingCode: buildingCode,
      floorCode: floorCode,
      residenceCode: residenceCode,
      roomCode: roomCode,
    })

    expect(response.status).toBe(200)
    expect(response.body.content).toBeDefined()
    expect(Array.isArray(response.body.content)).toBe(true)

    const component = response.body.content[0]
    expect(component.id).toBeDefined()
    expect(component.code).toBeDefined()
    expect(component.name).toBeDefined()
  })

  it('should validate maintenanceUnit parameter', async () => {
    const response = await request(app.callback()).get('/components').query({
      buildingCode: '',
      floorCode: '',
      residenceCode: '',
      roomCode: '',
    })

    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
    if (response.status === 500) {
      console.error('Test failed with reason:', response.body.reason)
    }
  })

  it('should include residence link when queried by residence', async () => {
    const testResidenceCode = '0790101001'
    const response = await request(app.callback())
      .get('/components')
      .query({ type: 'residence', residenceCode: testResidenceCode })

    expect(response.status).toBe(200)
    if (response.body.content.length > 0) {
      const component = response.body.content[0]
      expect(component._links.residence).toBeDefined()
      expect(component._links.residence.href).toBe(`/residences/${testResidenceCode}`)
    }
  })
})
