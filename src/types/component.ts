import { z } from 'zod'
import { BaseBasicSchema, TimestampSchema } from './shared'

export const componentsQueryParamsSchema = z.object({
  maintenanceUnit: z
    .string()
    .min(1, { message: 'maintenanceUnit is required and cannot be empty.' }),
})

export const ComponentSchema = z.object({
  id: z.string().trim().describe('Unique identifier for the component'),
  code: z.string().trim().describe('Component code used in the system'),
  name: z.string().trim().describe('Display name of the component'),
  details: z.object({
    manufacturer: z.string().trim().nullable().describe('Manufacturer of the component'),
    typeDesignation: z.string().trim().nullable().describe('Type designation or model number'),
  }).describe('Detailed component information'),
  dates: z.object({
    installation: z.date().nullable().describe('Date when component was installed'),
    warrantyEnd: z.date().nullable().describe('End date of warranty period'),
  }).describe('Important dates related to the component'),
  classification: z.object({
    componentType: z.object({
      code: z.string().trim().describe('Component type code'),
      name: z.string().trim().describe('Component type name'),
    }).describe('Type classification of the component'),
    category: z.object({
      code: z.string().trim().describe('Category code'),
      name: z.string().trim().describe('Category name'),
    }).describe('Category classification of the component'),
  }).describe('Component classification information'),
  maintenanceUnits: z.array(
    z.object({
      id: z.string().trim().describe('Maintenance unit ID'),
      code: z.string().trim().describe('Maintenance unit code'),
      name: z.string().trim().describe('Maintenance unit name'),
    })
  ).describe('Associated maintenance units'),
  _links: z.object({
    self: z.object({
      href: z.string().trim().describe('URI to the component resource'),
    }),
    maintenanceUnit: z.object({
      href: z.string().trim().describe('URI to the associated maintenance unit'),
    }),
    componentType: z.object({
      href: z.string().trim().describe('URI to the component type resource'),
    }),
    building: z.object({
      href: z.string().trim().describe('URI to the associated building'),
    }),
  }).describe('HATEOAS links for resource navigation'),
})

export type Component = z.infer<typeof ComponentSchema>
