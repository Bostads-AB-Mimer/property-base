import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type ComponentWithRelations = {
  id: string
  code: string
  name: string | null
  manufacturer: string | null
  typeDesignation: string | null
  installationDate: Date | null
  warrantyEndDate: Date | null
  componentType: {
    componentTypeCode: string
    name: string | null
  } | null
  componentCategory: {
    code: string
    name: string | null
  } | null
  propertyStructures: Array<{
    maintenanceUnitByCode: {
      maintenanceUnitId: string
      maintenanceUnitCode: string
      name: string | null
    } | null
  }>
}

export const getComponentByMaintenanceUnitCode = async (
  maintenanceUnitCode: string
): Promise<ComponentWithRelations[]> => {
  const components = await prisma.component.findMany({
    where: {
      propertyStructures: {
        some: {
          maintenanceUnitByCode: {
            maintenanceUnitCode: maintenanceUnitCode
          }
        }
      }
    },
    include: {
      componentType: true,
      componentCategory: true,
      propertyStructures: {
        include: {
          maintenanceUnitByCode: true
        }
      }
    },
    orderBy: {
      installationDate: 'desc'
    }
  })

  return components.map(component => ({
    id: component.id,
    code: component.code,
    name: component.name,
    details: {
      manufacturer: component.manufacturer,
      typeDesignation: component.typeDesignation
    },
    dates: {
      installation: component.installationDate,
      warrantyEnd: component.warrantyEndDate
    },
    classification: {
      componentType: component.componentType ? {
        code: component.componentType.componentTypeCode,
        name: component.componentType.name || ''
      } : null,
      category: component.componentCategory ? {
        code: component.componentCategory.code,
        name: component.componentCategory.name || ''
      } : null
    },
    maintenanceUnits: component.propertyStructures.map(ps => ({
      id: ps.maintenanceUnitByCode?.maintenanceUnitId || '',
      code: ps.maintenanceUnitByCode?.maintenanceUnitCode || '',
      name: ps.maintenanceUnitByCode?.name || ''
    }))
  }))
}
