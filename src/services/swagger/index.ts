import KoaRouter from '@koa/router'
import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerSpec } from '../../swagger'
import { ResidenceSchema } from '../../types/residence'
import { BuildingTypeSchema, BuildingListSchema } from '../../types/building'
import { ComponentTypeSchema, ComponentListSchema } from '../../types/component'
import { PropertyTypeSchema, PropertyListSchema } from '../../types/property'
import { StaircaseSchema, StaircaseListSchema } from '../../types/staircase'
import { RoomSchema, RoomListSchema } from '../../types/room'
import zodToJsonSchema from 'zod-to-json-schema'

const schemas = {
  ...zodToJsonSchema(ResidenceSchema, {
    name: 'Residence',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(BuildingTypeSchema, {
    name: 'Building',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(ComponentTypeSchema, {
    name: 'Component',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(PropertyTypeSchema, {
    name: 'Property',
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
