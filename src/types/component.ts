import { z } from 'zod'

export const ComponentTypeSchema = z.object({
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
      id: z.string(),
      code: z.string(),
      name: z.string(),
    })
  ),
})

export const ComponentListSchema = z.array(ComponentTypeSchema)

export type Component = z.infer<typeof ComponentTypeSchema>
export type ComponentList = z.infer<typeof ComponentListSchema>
