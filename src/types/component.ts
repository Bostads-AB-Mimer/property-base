import { z } from 'zod'

export const ComponentSchema = z.object({
  id: z.string().trim().describe('Unique identifier for the component'),
  code: z.string().trim().describe('Component code used in the system'),
  name: z.string().trim().describe('Display name of the component'),
  _links: z.object({
    self: z.object({
      href: z.string().describe('URI to the component resource'),
    }),
    maintenanceUnit: z.object({
      href: z.string().describe('URI to the associated maintenance unit'),
    }),
    componentType: z.object({
      href: z.string().describe('URI to the component type definition'),
    }),
  }).describe('HATEOAS links for resource navigation'),
  details: z.object({
    manufacturer: z.string().nullable(),
    typeDesignation: z.string().nullable(),
  }),
  dates: z.object({
    installation: z.date().nullable(),
    warrantyEnd: z.date().nullable(),
  }),
  classification: z.object({
    componentType: z.object({
      code: z.string(),
      name: z.string(),
    }),
    category: z.object({
      code: z.string(),
      name: z.string(),
    }),
  }),
  maintenanceUnits: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
    })
  ),
})

export type Component = z.infer<typeof ComponentSchema>
