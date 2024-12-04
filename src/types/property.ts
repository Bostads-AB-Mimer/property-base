import { z } from 'zod'

export const PropertyDesignationSchema = z.object({
  propertyDesignationId: z.string(),
  code: z.string(),
  name: z.string().nullable(),
  timestamp: z.string()
})

export const PropertySchema = z.object({
  id: z.string().describe('Unique identifier for the property'),
  code: z.string().describe('Property code used in the system'),
  tract: z.string().describe('Tract identifier'),
  propertyDesignation: PropertyDesignationSchema.nullable(),
  propertyObject: z.object({
    deleted: z.boolean(),
    timestamp: z.string(),
    objectType: z.object({
      id: z.string(),
      code: z.string(),
      name: z.string().nullable()
    }).nullable(),
    condition: z.union([z.string(), z.number()]).nullable(),
    conditionInspectionDate: z.date().nullable(),
    energy: z.object({
      class: z.number().nullable(),
      registered: z.date().nullable(),
      received: z.date().nullable(),
      index: z.number().nullable(),
    })
  }).nullable(),
  _links: z.object({
    self: z.object({
      href: z.string().describe('URI to the property resource'),
    }),
    buildings: z.object({
      href: z.string().describe('URI to list buildings in this property'),
    }),
    residences: z.object({
      href: z.string().describe('URI to list residences in this property'),
    }),
  }).describe('HATEOAS links for resource navigation'),
})

export type PropertyDesignation = z.infer<typeof PropertyDesignationSchema>
export type Property = z.infer<typeof PropertySchema>
