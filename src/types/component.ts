import { z } from 'zod'
import { BaseBasicSchema, TimestampSchema } from './shared'

export const componentsQueryParamsSchema = z.object({
  maintenanceUnit: z
    .string()
    .min(1, { message: 'maintenanceUnit is required and cannot be empty.' }),
})

export const ComponentSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
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
      id: z.string().trim(),
      code: z.string().trim(),
      name: z.string().trim(),
    })
  ),
})

export type Component = z.infer<typeof ComponentSchema>
