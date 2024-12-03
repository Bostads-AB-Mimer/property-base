import { z } from 'zod'

export const StaircaseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().nullable(),
  features: z.object({
    floorPlan: z.string().nullable(),
    accessibleByElevator: z.boolean(),
  }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  deleted: z.boolean(),
  timestamp: z.string(),
})

export const StaircaseListSchema = z.array(StaircaseSchema)

export type Staircase = z.infer<typeof StaircaseSchema>
export type StaircaseList = z.infer<typeof StaircaseListSchema>
