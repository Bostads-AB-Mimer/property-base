import {
  PropertyBasicInfo,
  PropertyWithObject,
} from '../../adapters/property-adapter'
import { PropertySchema } from '../../types/property'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToProperty(dbRecord: PropertyWithObject): ReturnType<typeof PropertySchema.parse>
export function mapDbToProperty(dbRecord: PropertyBasicInfo): ReturnType<typeof PropertySchema.parse>
export function mapDbToProperty(dbRecord: PropertyWithObject | PropertyBasicInfo) {
  if (!dbRecord) return null

  const baseProperty = {
    id: dbRecord.id || '',
    code: dbRecord.code || '',
    tract: dbRecord.tract || '',
    propertyDesignation: dbRecord.propertyDesignation
      ? {
          propertyDesignationId: dbRecord.propertyDesignation.id || '',
          code: dbRecord.propertyDesignation.code || '',
          name: dbRecord.propertyDesignation.name || '',
          timestamp: dbRecord.propertyDesignation.timestamp,
        }
      : null,
    _links: {
      self: {
        href: `/properties/${dbRecord.id?.trim() || ''}`,
      },
      details: {
        href: `/properties/${dbRecord.id?.trim() || ''}/details`,
      },
      buildings: {
        href: `/buildings/${dbRecord.code?.trim() || ''}`,
      },
      residences: {
        href: `/residences?propertyCode=${dbRecord.code?.trim() || ''}`,
      },
    },
  }

  if ('propertyObject' in dbRecord) {
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
