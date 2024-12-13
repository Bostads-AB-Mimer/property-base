import { PrismaClient } from '@prisma/client'
import { map } from 'lodash'

const prisma = new PrismaClient({
  log: ['query'],
})

//todo: add types

//todo: this does not get the components, it gets the maintenance units which is another entity
export const getComponentByMaintenanceUnitCode = async (
  maintenanceUnitCode: string
) => {
  const response = await prisma.component.findMany({
    where: {
      propertyStructures: {
        some: {
          maintenanceUnitByCode: {
            code: maintenanceUnitCode,
          },
        },
      },
    },
    orderBy: {
      installationDate: 'desc',
    },
    select: {
      id: true,
      code: true,
      name: true,
      manufacturer: true,
      typeDesignation: true,
      installationDate: true,
      warrantyEndDate: true,
      componentType: {
        select: {
          code: true,
          name: true,
        },
      },
      componentCategory: {
        select: {
          code: true,
          name: true,
        },
      },
      propertyStructures: {
        select: {
          maintenanceUnitByCode: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      },
    },
  })

  return response.map((component) => ({
    id: component.id,
    code: component.code,
    name: component.name,
    details: {
      manufacturer: component.manufacturer,
      typeDesignation: component.typeDesignation,
    },
    dates: {
      installation: component.installationDate,
      warrantyEnd: component.warrantyEndDate,
    },
    classification: {
      componentType: {
        code: component.componentType?.code ?? '',
        name: component.componentType?.name ?? '',
      },
      category: {
        code: component.componentCategory?.code ?? '',
        name: component.componentCategory?.name ?? '',
      },
    },
    maintenanceUnits: component.propertyStructures.map((ps) => ({
      id: ps.maintenanceUnitByCode?.id ?? '',
      code: ps.maintenanceUnitByCode?.code ?? '',
      name: ps.maintenanceUnitByCode?.name ?? '',
    })),
  }))
}

export const newComponentFunction = async (
  buildingCode: string,
  floorCode: string,
  residenceCode: string,
  roomCode: string
) => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      floorCode: floorCode,
      residenceCode: residenceCode,
      roomCode: roomCode,
      NOT: {
        componentId: null,
      },
      localeId: null,
    },
  })
  //todo: qualify select and add mapper
  return prisma.component.findMany({
    where: {
      objectId: {
        in: map(propertyStructures, 'objectId'),
      },
    },
  })
}

export const getComponentById = async (id: string) => {
  return prisma.component.findUnique({
    where: {
      id: id,
    },
    //todo: qualify select and add mapper
  })
}
