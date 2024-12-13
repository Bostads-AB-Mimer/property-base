import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
})

//todo: add types

const getBuildings = async (propertyCode: string) => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      propertyCode: {
        contains: propertyCode,
      },
      NOT: {
        buildingId: null,
      },
      floorId: null,
    },
  })

  return prisma.building.findMany({
    where: {
      propertyObjectId: {
        in: map(propertyStructures, 'propertyObjectId'),
      },
    },
    include: {
      buildingType: true,
      marketArea: true,
      district: true,
      propertyDesignation: true,
    },
  })
}

const getBuildingById = async (id: string) => {
  return prisma.building.findFirst({
    where: {
      id: id,
    },
    include: {
      buildingType: true,
      marketArea: true,
      propertyDesignation: true,
      district: true,
    },
  })
}

export { getBuildings, getBuildingById }
