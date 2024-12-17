import request from 'supertest'
import app from '../app'

describe('Components API', () => {
  let buildingCode: string
  let floorCode: string
  let residenceCode: string
  let roomCode: string

  beforeAll(async () => {
    // Get codes needed for testing
    const buildingsResponse = await request(app.callback())
      .get('/buildings')
      .query({ propertyCode: '01901' })
    buildingCode = buildingsResponse.body.content[0].code

    const staircaseResponse = await request(app.callback())
      .get('/staircases')
      .query({ buildingCode })
    floorCode = staircaseResponse.body.content[0].code

    const residencesResponse = await request(app.callback())
      .get('/residences')
      .query({ buildingCode })
    const residence = residencesResponse.body.content[0]
    residenceCode = residence.code

    const roomsResponse = await request(app.callback())
      .get('/rooms')
      .query({ buildingCode, floorCode, residenceCode })
    roomCode = roomsResponse.body.content[2].code
  })

  it('should return components for a maintenance unit', async () => {
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
    const response = await request(app.callback())
      .get('/components')
      .query({ maintenanceUnit: '' }) // Empty maintenance unit code

    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
  })
})
