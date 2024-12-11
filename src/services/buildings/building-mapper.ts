import { BuildingWithRelations } from '../../adapters/building-adapter'
import { BuildingSchema, BuildingDetailsSchema } from '../../types/building'
import { toBoolean, trimString } from '../../utils/data-conversion'

export function mapDbToBuilding(dbRecord: BuildingWithRelations) {
  if (!dbRecord) return null

  return BuildingSchema.parse({
    id: trimString(dbRecord.id),
    code: trimString(dbRecord.buildingCode),
    name: trimString(dbRecord.name),
    buildingType: dbRecord.buildingType ? {
      id: trimString(dbRecord.buildingType.id),
      code: trimString(dbRecord.buildingType.buildingTypeCode),
      name: trimString(dbRecord.buildingType.buildingTypeName),
    } : null,
    construction: {
      constructionYear: dbRecord.constructionYear,
      renovationYear: dbRecord.renovationYear,
      valueYear: dbRecord.valueYear,
    },
    features: {
      heating: trimString(dbRecord.heating),
      fireRating: trimString(dbRecord.fireRating),
    },
    insurance: {
      class: trimString(dbRecord.insuranceClass),
      value: dbRecord.insuranceValue,
    },
    deleted: toBoolean(dbRecord.deleteMark),
    timestamp: dbRecord.timestamp,
    _links: {
      self: {
        href: `/buildings/${dbRecord.id}`,
      },
      property: {
        href: `/properties/${dbRecord.propertyDesignation?.code || ''}`,
      },
      residences: {
        href: `/residences?buildingCode=${dbRecord.buildingCode}`,
      },
      staircases: {
        href: `/staircases?buildingCode=${dbRecord.buildingCode}`,
      },
    },
  })
}

export function mapDbToBuildingDetails(dbRecord: BuildingWithRelations) {
  if (!dbRecord) return null

  const building = mapDbToBuilding(dbRecord)
  if (!building) return null

  return BuildingDetailsSchema.parse({
    ...building,
    propertyObject: {
      energy: {
        energyClass: dbRecord.energyClass || 0,
        heatingNature: dbRecord.heatingNature || 0,
      },
      condition: dbRecord.condition || 0,
      conditionInspectionDate: dbRecord.conditionInspectionDate,
    },
  })
}
