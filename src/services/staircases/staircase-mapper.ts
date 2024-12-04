import { Staircase } from '@prisma/client'
import { StaircaseSchema } from '../../types/staircase'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToStaircase(dbRecord: Staircase) {
  if (!dbRecord) return null

  return StaircaseSchema.parse({
    id: dbRecord.id?.trim() || '',
    code: dbRecord.code?.trim() || '',
    name: dbRecord.name?.trim() || '',
    features: {
      floorPlan: dbRecord.floorPlan,
      accessibleByElevator: toBoolean(dbRecord.accessibleByElevator),
    },
    dates: {
      from: dbRecord.fromDate,
      to: dbRecord.toDate,
    },
    deleted: toBoolean(dbRecord.deleteMark),
    timestamp: dbRecord.timestamp,
  })
}
