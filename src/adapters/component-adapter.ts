import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type ComponentWithRelations = {
  id: string
  code: string
  name: string | null
  details: {
    manufacturer: string | null
    typeDesignation: string | null
  }
  dates: {
    installation: Date | null
    warrantyEnd: Date | null
  }
  classification: {
    componentType: {
      code: string
      name: string | null
    } | null
    category: {
      code: string
      name: string | null
    } | null
  }
  maintenanceUnits: Array<{
    id: string
    code: string
    name: string | null
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

  return components.map(component => {
    const mappedComponent: ComponentWithRelations = {
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
          name: component.componentType.name
        } : null,
        category: component.componentCategory ? {
          code: component.componentCategory.code,
          name: component.componentCategory.name
        } : null
      },
      maintenanceUnits: component.propertyStructures.map(ps => ({
        id: ps.maintenanceUnitByCode?.maintenanceUnitId || '',
        code: ps.maintenanceUnitByCode?.maintenanceUnitCode || '',
        name: ps.maintenanceUnitByCode?.name || null
      }))
    }
    return mappedComponent
  })
}
