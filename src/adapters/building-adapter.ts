import { map } from 'lodash'
import { Prisma, PrismaClient } from '@prisma/client'
import { mapDbToBuilding } from '../services/buildings/building-mapper'

const prisma = new PrismaClient({})

export type BuildingWithRelations = Prisma.BuildingGetPayload<{
  include: {
    buildingType: true
    marketArea: true
    district: true
    propertyDesignation: true
  }
}>

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
  
  const buildings = await prisma.building.findMany({
    where: {
      objectId: {
        in: map(propertyStructures, 'objectId'),
      },
    },
    include: {
      buildingType: true,
      marketArea: true,
      district: true,
      propertyDesignation: true,
    },
  })

  return buildings
    .map(mapDbToBuilding)
    .filter((b): b is NonNullable<typeof b> => b !== null)
}

const getBuildingByCode = async (buildingCode: string) => {
  const building = await prisma.building.findFirst({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
    },
    include: {
      buildingType: true,
      marketArea: true,
      propertyDesignation: true,
      district: true,
    },
  })
}

export { getBuildings, getBuildingByCode }
