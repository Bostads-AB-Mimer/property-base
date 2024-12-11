import { Component, ComponentType, ComponentCategory, PropertyStructure, MaintenanceUnit, Prisma } from '@prisma/client'
import { ComponentSchema } from '../../types/component'
import { trimString } from '../../utils/data-conversion'

type ComponentWithRelations = Prisma.ComponentGetPayload<{
  include: {
    componentType: true
    componentCategory: true
    propertyStructures: {
      include: {
        maintenanceUnitByCode: true
      }
    }
  }
}>

export function mapDbToComponent(dbRecord: ComponentWithRelations) {
  if (!dbRecord) return null

  return ComponentSchema.parse({
    id: trimString(dbRecord.id),
    code: trimString(dbRecord.code),
    name: trimString(dbRecord.name),
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
        href: `/components/${dbRecord.id}`,
      },
      maintenanceUnit: {
        href: `/maintenanceUnits/${dbRecord.code}`,
      },
      componentType: {
        href: `/componentTypes/${dbRecord.componentType?.componentTypeCode || ''}`,
      },
      building: {
        href: `/buildings/${dbRecord.buildingCode || ''}`,
      },
    }
  })
}
import { Component } from '../../types/component'
import { trimString } from '../../utils/data-conversion'

export function mapDbToComponent(dbRecord: any): Component | null {
  if (!dbRecord) return null

  return {
    id: trimString(dbRecord.id) || '',
    code: trimString(dbRecord.code) || '',
    name: trimString(dbRecord.name) || '',
    details: {
      manufacturer: trimString(dbRecord.manufacturer),
      typeDesignation: trimString(dbRecord.typeDesignation),
    },
    dates: {
      installation: dbRecord.installationDate,
      warrantyEnd: dbRecord.warrantyEndDate,
    },
    classification: {
      componentType: {
        code: trimString(dbRecord.componentType?.componentTypeCode) || '',
        name: trimString(dbRecord.componentType?.name) || '',
      },
      category: {
        code: trimString(dbRecord.componentCategory?.code) || '',
        name: trimString(dbRecord.componentCategory?.name) || '',
      },
    },
    maintenanceUnits: (dbRecord.propertyStructures || []).map((ps: any) => ({
      id: trimString(ps.maintenanceUnitByCode?.maintenanceUnitId) || '',
      code: trimString(ps.maintenanceUnitByCode?.maintenanceUnitCode) || '',
      name: trimString(ps.maintenanceUnitByCode?.name) || '',
    })),
    _links: {
      self: {
        href: `/components/${dbRecord.id}`,
      },
      maintenanceUnit: {
        href: `/maintenanceUnits/${dbRecord.code}`,
      },
      componentType: {
        href: `/componentTypes/${dbRecord.componentType?.componentTypeCode || ''}`,
      },
      building: {
        href: `/buildings/${dbRecord.buildingCode || ''}`,
      },
    },
  }
}
