import {
  PropertyBasicInfo,
  PropertyDetails,
} from '../../adapters/property-adapter'
import { PropertySchema } from '../../types/property'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToProperty(dbRecord: PropertyDetails | PropertyBasicInfo) {
  if (!dbRecord) return null

  return PropertySchema.parse({
    id: dbRecord.id,
    code: dbRecord.code,
    name: dbRecord.name || '',
    companyId: dbRecord.companyId,
    companyName: dbRecord.companyName,
    propertyId: dbRecord.propertyId,
    tract: dbRecord.tract || null,
    propertyDesignation: dbRecord.propertyDesignation ? {
      propertyDesignationId: dbRecord.propertyDesignation.id,
      code: dbRecord.propertyDesignation.code,
      name: dbRecord.propertyDesignation.name,
      timestamp: dbRecord.propertyDesignation.timestamp,
    } : null,
    _links: {
      self: {
        href: `/properties/${dbRecord.id}`,
      },
      details: {
        href: `/properties/${dbRecord.id}/details`,
      },
      buildings: {
        href: `/buildings?propertyCode=${dbRecord.code}`,
      },
      residences: {
        href: `/residences?propertyCode=${dbRecord.code}`,
      },
    },
  })
}

export function mapDbToPropertyDetails(dbRecord: PropertyDetails) {
  if (!dbRecord) return null

  return PropertyDetailsSchema.parse({
    ...mapDbToProperty(dbRecord),
    propertyObject: dbRecord.propertyObject ? {
      deleted: toBoolean(dbRecord.propertyObject.deleteMark),
      timestamp: dbRecord.propertyObject.timestamp,
      objectType: dbRecord.propertyObject.objectTypeId ? {
        id: dbRecord.propertyObject.objectTypeId,
        code: dbRecord.propertyObject.objectTypeId,
        name: null,
      } : null,
      condition: dbRecord.propertyObject.condition,
      conditionInspectionDate: dbRecord.propertyObject.conditionInspectionDate,
      energy: {
        class: dbRecord.propertyObject.energyClass,
        registered: dbRecord.propertyObject.energyRegistered,
        received: dbRecord.propertyObject.energyReceived,
        index: dbRecord.propertyObject.energyIndex,
      },
    } : null,
  })
}
