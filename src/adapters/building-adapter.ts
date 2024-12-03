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

  return buildings.map(mapDbToBuilding)
}

//todo: remove this endpoint?
const getBuildingByCode = async (buildingCode: string) => {
  return prisma.building.findFirst({
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
