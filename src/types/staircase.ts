import { z } from 'zod'

export const StaircaseSchema = z.object({
  id: z.string().trim(),
  code: z.string().trim(),
  name: z.string().trim().nullable(),
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

export type Staircase = z.infer<typeof StaircaseSchema>
