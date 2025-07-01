import { z } from 'zod'

export const MaintenanceUnitSchema = z.object({
  id: z.string(),
  rentalPropertyId: z.string().optional(),
  code: z.string(),
  caption: z.string(),
  type: z.string().nullable().optional(),
  propertyCode: z.string().nullable(),
  propertyName: z.string().nullable(),
})

export type MaintenanceUnitInfo = z.infer<typeof MaintenanceUnitSchema>
