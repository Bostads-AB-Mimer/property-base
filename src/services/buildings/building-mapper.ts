import { BuildingWithRelations } from '../../adapters/building-adapter'
import { BuildingSchema } from '../../types/building'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToBuilding(dbRecord: BuildingWithRelations) {
  if (!dbRecord) return null

  return BuildingSchema.parse({
    id: dbRecord.id || '',
    code: dbRecord.buildingCode || '',
    name: dbRecord.name || '',
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
    _links: {
      self: {
        href: `/buildings/${dbRecord.id}`,
      },
      property: {
        href: `/properties/${dbRecord.propertyDesignation?.code || ''}`,
      },
      residences: {
        href: `/residences/buildingCode/${dbRecord.buildingCode}`,
      },
      staircases: {
        href: `/staircases/${dbRecord.buildingCode}`,
      },
    },
  })
}
