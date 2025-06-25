import KoaRouter from '@koa/router'
import swaggerJsdoc from 'swagger-jsdoc'
import zodToJsonSchema from 'zod-to-json-schema'

import {
  GetLocationByRentalIdResponseSchema,
  LocationDetailsSchema,
} from '@src/types/location'
import { BuildingSchema } from '../types/building'
import { CompanyDetailsSchema, CompanySchema } from '../types/company'
import { ComponentSchema } from '../types/component'
import { MaintenanceUnitSchema } from '../types/maintenance-unit'
import { PropertyDetailsSchema, PropertySchema } from '../types/property'
import {
  GetResidenceByRentalIdResponseSchema,
  ResidenceByRentalIdSchema,
  ResidenceDetailedSchema,
  ResidenceSchema,
  ResidenceSearchResultSchema,
} from '../types/residence'
import { RoomSchema } from '../types/room'
import { StaircaseSchema } from '../types/staircase'

import { swaggerSpec } from '../swagger'
import { ParkingSpaceSchema } from '@src/types/parking-space'

const schemas = {
  ...zodToJsonSchema(ResidenceSchema, {
    name: 'Residence',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(ResidenceDetailedSchema, {
    name: 'ResidenceDetails',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(ResidenceSearchResultSchema, {
    name: 'ResidenceSearchResult',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(BuildingSchema, {
    name: 'Building',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(ComponentSchema, {
    name: 'Component',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(PropertySchema, {
    name: 'Property',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(PropertyDetailsSchema, {
    name: 'PropertyDetails',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(StaircaseSchema, {
    name: 'Staircase',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(RoomSchema, {
    name: 'Room',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(CompanySchema, {
    name: 'Company',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(CompanyDetailsSchema, {
    name: 'CompanyDetails',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(MaintenanceUnitSchema, {
    name: 'MaintenanceUnit',
  }).definitions,
  ...zodToJsonSchema(ResidenceByRentalIdSchema, {
    name: 'ResidenceByRentalId',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(GetResidenceByRentalIdResponseSchema, {
    name: 'GetResidenceByRentalIdResponse',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(ParkingSpaceSchema, {
    name: 'ParkingSpace',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(LocationDetailsSchema, {
    name: 'LocationDetails',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(GetLocationByRentalIdResponseSchema, {
    name: 'GetLocationByRentalIdResponse',
    target: 'openApi3',
  }).definitions,
}

swaggerSpec.definition.components = {
  ...swaggerSpec.definition.components,
  schemas,
}

const swaggerOptions = swaggerJsdoc(swaggerSpec)

export const routes = (router: KoaRouter) => {
  router.get('/swagger.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = swaggerOptions
  })
}
