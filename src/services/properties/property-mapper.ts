import { PropertyWithObject } from '../../adapters/property-adapter'
import { PropertySchema } from '../../types/property'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToProperty(dbRecord: PropertyWithObject) {
  if (!dbRecord) return null

  return PropertySchema.parse({
    id: dbRecord.id,
    code: dbRecord.code,
    tract: dbRecord.tract,
    propertyDesignation: {
      propertyDesignationId: dbRecord.propertyDesignation.propertyDesignationId,
      code: dbRecord.propertyDesignation.code,
      name: dbRecord.propertyDesignation.name,
      timestamp: dbRecord.propertyDesignation.timestamp
    },
    propertyObject: dbRecord.propertyObject ? {
      deleted: toBoolean(dbRecord.propertyObject.deleteMark),
      timestamp: dbRecord.propertyObject.timestamp,
      objectType: dbRecord.propertyObject.objectTypeId ? {
        id: dbRecord.propertyObject.objectTypeId,
        code: dbRecord.propertyObject.objectTypeId,
        name: null
      } : null,
      condition: dbRecord.propertyObject.condition,
      conditionInspectionDate: dbRecord.propertyObject.conditionInspectionDate,
      energy: {
        class: dbRecord.propertyObject.energyClass,
        registered: dbRecord.propertyObject.energyRegistered,
        received: dbRecord.propertyObject.energyReceived,
        index: dbRecord.propertyObject.energyIndex
      }
    } : null,
    _links: {
      self: {
        href: `/properties/${dbRecord.id}`
      },
      buildings: {
        href: `/buildings/${dbRecord.code}`
      },
      residences: {
        href: `/residences?propertyCode=${dbRecord.code}`
      }
    }
  })
}
