import { Staircase } from '@prisma/client'
import { StaircaseSchema } from '../../types/staircase'
import { toBoolean, trimString } from '../../utils/data-conversion'

export function mapDbToStaircase(dbRecord: Staircase) {
  if (!dbRecord) return null

  return StaircaseSchema.parse({
    id: dbRecord.id || '',
    code: dbRecord.code || '',
    name: dbRecord.name || '',
    _links: {
      self: {
        href: `/staircases/${dbRecord.id}`,
      },
      details: {
        href: `/staircases/${dbRecord.id}/details`,
      },
    },
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
