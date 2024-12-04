import { ComponentSchema } from '../../types/component'

export function mapDbToComponent(dbRecord: any) {
  if (!dbRecord) return null

  return ComponentSchema.parse({
    id: dbRecord.id?.trim() || '',
    code: dbRecord.code?.trim() || '',
    name: dbRecord.name?.trim() || '',
    details: {
      manufacturer: dbRecord.manufacturer,
      typeDesignation: dbRecord.typeDesignation,
    },
    dates: {
      installation: dbRecord.installationDate,
      warrantyEnd: dbRecord.warrantyEndDate,
    },
    classification: {
      componentType: {
        code: dbRecord.componentType?.componentTypeCode || '',
        name: dbRecord.componentType?.name || '',
      },
      category: {
        code: dbRecord.componentCategory?.code || '',
        name: dbRecord.componentCategory?.name || '',
      },
    },
    maintenanceUnits: dbRecord.propertyStructures?.map((ps: any) => ({
      id: ps.maintenanceUnitByCode?.maintenanceUnitId || '',
      code: ps.maintenanceUnitByCode?.maintenanceUnitCode || '',
      name: ps.maintenanceUnitByCode?.name || '',
    })) || [],
    _links: {
      self: {
        href: `/components/${dbRecord.id}`
      },
      maintenanceUnit: {
        href: `/maintenanceUnits/${dbRecord.code}`
      },
      componentType: {
        href: `/componentTypes/${dbRecord.componentType?.componentTypeCode || ''}`
      }
    }
  })
}
