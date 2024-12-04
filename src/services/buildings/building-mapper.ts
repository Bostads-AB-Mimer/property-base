import { BuildingWithRelations } from '../../adapters/building-adapter'
import { BuildingSchema } from '../../types/building'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToBuilding(dbRecord: BuildingWithRelations) {
  if (!dbRecord) return null

  return BuildingSchema.parse({
    id: dbRecord.id?.trim() || '',
    code: dbRecord.buildingCode?.trim() || '',
    name: dbRecord.name?.trim() || '',
    buildingType: dbRecord.buildingType
      ? {
          id: dbRecord.buildingType.id,
          code: dbRecord.buildingType.buildingTypeCode,
          name: dbRecord.buildingType.buildingTypeName?.trim() || '',
        }
      : null,
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
    deleted: toBoolean(dbRecord.deleteMark),
  })
}
