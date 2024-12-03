import { z } from 'zod'

export const BuildingTypeSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
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

export const BuildingListSchema = z.array(BuildingTypeSchema)

export type Building = z.infer<typeof BuildingTypeSchema>
export type BuildingList = z.infer<typeof BuildingListSchema>
