import {
  PropertyBasicInfo,
  PropertyWithObject,
} from '../../adapters/property-adapter'
import { PropertySchema } from '../../types/property'
import { toBoolean } from '../../utils/data-conversion'

function isPropertyWithObject(
  dbRecord: PropertyWithObject | PropertyBasicInfo
): dbRecord is PropertyWithObject {
  return 'propertyObject' in dbRecord
}

export function mapDbToProperty(
  dbRecord: PropertyWithObject | PropertyBasicInfo
) {
  if (!dbRecord) return null

  const baseProperty = {
    id: dbRecord.id?.trim() || '',
    code: dbRecord.code?.trim() || '',
    tract: dbRecord.tract?.trim() || '',
    propertyDesignation: dbRecord.propertyDesignation
      ? {
          propertyDesignationId: dbRecord.propertyDesignation.id?.trim() || '',
          code: dbRecord.propertyDesignation.code?.trim() || '',
          name: dbRecord.propertyDesignation.name?.trim() || '',
          timestamp: dbRecord.propertyDesignation.timestamp,
        }
      : null,
    _links: {
      self: {
        href: `/properties/${dbRecord.id?.trim() || ''}`,
      },
      buildings: {
        href: `/buildings/${dbRecord.code?.trim() || ''}`,
      },
      residences: {
        href: `/residences?propertyCode=${dbRecord.code?.trim() || ''}`,
      },
    },
  }

  if (isPropertyWithObject(dbRecord)) {
    return PropertySchema.parse({
      ...baseProperty,
      propertyObject: dbRecord.propertyObject
        ? {
            deleted: toBoolean(dbRecord.propertyObject.deleteMark),
            timestamp: dbRecord.propertyObject.timestamp,
            objectType: dbRecord.propertyObject.objectTypeId
              ? {
                  id: dbRecord.propertyObject.objectTypeId,
                  code: dbRecord.propertyObject.objectTypeId,
                  name: null,
                }
              : null,
            condition: dbRecord.propertyObject.condition,
            conditionInspectionDate:
              dbRecord.propertyObject.conditionInspectionDate,
            energy: {
              class: dbRecord.propertyObject.energyClass,
              registered: dbRecord.propertyObject.energyRegistered,
              received: dbRecord.propertyObject.energyReceived,
              index: dbRecord.propertyObject.energyIndex,
            },
          }
        : null,
    })
  }

  return PropertySchema.parse({
    ...baseProperty,
    propertyObject: null,
  })
}
