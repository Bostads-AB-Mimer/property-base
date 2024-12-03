import { z } from 'zod'

export const StaircaseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string().nullable(),
  floorPlan: z.string().nullable(),
  accessibleByElevator: z.number(),
  deleteMark: z.number(),
  fromDate: z.date(),
  toDate: z.date(),
  timestamp: z.string(),
})

export const StaircaseListSchema = z.array(StaircaseSchema)

export type Staircase = z.infer<typeof StaircaseSchema>
export type StaircaseList = z.infer<typeof StaircaseListSchema>
