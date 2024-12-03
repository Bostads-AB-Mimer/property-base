import { Building } from '@prisma/client'
import { BuildingSchema } from '../../types/building'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToBuilding(dbRecord: Building) {
  if (!dbRecord) return null

  return BuildingSchema.parse({
    id: dbRecord.buildingId,
    code: dbRecord.buildingCode,
    name: dbRecord.name,
    buildingType: dbRecord.buildingType ? {
      id: dbRecord.buildingType.buildingTypeId,
      code: dbRecord.buildingType.code,
      name: dbRecord.buildingType.name,
    } : null,
    construction: {
      constructionYear: dbRecord.constructionYear,
      renovationYear: dbRecord.renovationYear,
      valueYear: dbRecord.valueYear,
    },
    features: {
      heating: dbRecord.heating,
      fireRating: dbRecord.fireRating,
    },
    insurance: {
      class: dbRecord.insuranceClass,
      value: dbRecord.insuranceValue,
    },
    deleted: toBoolean(dbRecord.deleteMark)
  })
}
