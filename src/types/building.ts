import { z } from 'zod'

export const BuildingSchema = z.object({
  id: z.string().describe('Unique identifier for the building'),
  code: z.string().describe('Building code used in the system'),
  name: z.string().describe('Display name of the building'),
  _links: z.object({
    self: z.object({
      href: z.string().describe('URI to the building resource'),
    }),
    property: z.object({
      href: z.string().describe('URI to the associated property'),
    }),
    residences: z.object({
      href: z.string().describe('URI to list all residences in this building'),
    }),
    staircases: z.object({
      href: z.string().describe('URI to list all staircases in this building'),
    }),
  }).describe('HATEOAS links for resource navigation'),
  buildingType: z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
  }),
  construction: z.object({
    constructionYear: z.number().nullable(),
    renovationYear: z.number().nullable(),
    valueYear: z.number().nullable(),
  }),
  features: z.object({
    heating: z.string().nullable(),
    fireRating: z.string().nullable(),
  }),
  insurance: z.object({
    class: z.string().nullable(),
    value: z.number().nullable(),
  }),
  deleted: z.boolean(),
})

export type Building = z.infer<typeof BuildingSchema>
