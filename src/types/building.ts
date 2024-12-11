import { z } from 'zod'
import { BaseBasicSchema, TimestampSchema } from './shared'

export const buildingsQueryParamsSchema = z.object({
  propertyCode: z.string().min(1, {
    message: 'propertyCode is required and must be a non-empty string.',
  }),
})

// Base schema for common building fields
export const BuildingBaseSchema = BaseBasicSchema.extend({
  deleted: z.boolean(),
  timestamp: z.string().trim(),
})

export const BuildingTypeSchema = z.object({
  id: z.string().trim(),
  code: z.string().trim(),
  name: z.string().trim(),
}).describe('Type classification of the building')

export const BuildingSchema = BuildingBaseSchema.extend({
  buildingType: BuildingTypeSchema.nullable(),
  construction: z.object({
    constructionYear: z.number().nullable().describe('Year the building was constructed'),
    renovationYear: z.number().nullable().describe('Year of last major renovation'),
    valueYear: z.number().nullable().describe('Year used for value calculations'),
  }).describe('Construction and renovation details'),
  features: z.object({
    heating: z.string().trim().nullable().describe('Heating system type'),
    fireRating: z.string().trim().nullable().describe('Fire safety rating'),
  }).describe('Building features and characteristics'),
  insurance: z.object({
    class: z.string().trim().nullable().describe('Insurance classification'),
    value: z.number().nullable().describe('Insured value'),
  }).describe('Insurance information'),
  _links: z.object({
    self: z.object({
      href: z.string().trim().describe('URI to the building resource'),
    }),
    property: z.object({
      href: z.string().trim().describe('URI to the associated property'),
    }),
    residences: z.object({
      href: z.string().trim().describe('URI to list residences in this building'),
    }),
    staircases: z.object({
      href: z.string().trim().describe('URI to list staircases in this building'),
    }),
  }).describe('HATEOAS links for resource navigation'),
})

export const BuildingDetailsSchema = BuildingSchema.extend({
  propertyObject: z.object({
    energy: z.object({
      energyClass: z.number().describe('Energy efficiency classification'),
      heatingNature: z.number().describe('Nature of heating system'),
    }).describe('Energy-related information'),
    condition: z.number().describe('Overall condition rating'),
    conditionInspectionDate: z.date().nullable().describe('Date of last condition inspection'),
  }).describe('Additional property object details'),
})

export type Building = z.infer<typeof BuildingSchema>
export type BuildingDetails = z.infer<typeof BuildingDetailsSchema>
