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
  BuildingList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Building',
    },
  },
  ...zodToJsonSchema(ComponentTypeSchema, {
    name: 'Component',
    target: 'openApi3',
  }).definitions,
  ...zodToJsonSchema(PropertyTypeSchema, {
    name: 'Property',
    target: 'openApi3',
  }).definitions,
  PropertyList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Property',
    },
  },
  ...zodToJsonSchema(StaircaseSchema, {
    name: 'Staircase',
    target: 'openApi3',
  }).definitions,
  StaircaseList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Staircase',
    },
  },
  ...zodToJsonSchema(RoomSchema, {
    name: 'Room',
    target: 'openApi3',
  }).definitions,
  RoomList: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Room',
    },
  },
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
