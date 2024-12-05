import { Staircase } from '@prisma/client'
import { StaircaseSchema } from '../../types/staircase'
import { toBoolean, trimString } from '../../utils/data-conversion'

export function mapDbToStaircase(dbRecord: Staircase) {
  if (!dbRecord) return null

  return StaircaseSchema.parse({
    id: trimString(dbRecord.id) || '',
    code: trimString(dbRecord.code) || '',
    name: trimString(dbRecord.name) || '',
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
