import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
})

const getBuildings = async (propertyCode: string) => {
  // const result = await prisma.property.findMany({
  //   where: {
  //     code: propertyCode,
  //   },
  //
  //   include: {
  //     propertyDesignation: {
  //       select: {
  //         buildings: true,
  //       },
  //     },
  //     district: {
  //       select: {
  //         code: true,
  //         caption: true,
  //       },
  //     },
  //   },
  // })
  //
  // if (!result[0]) {
  //   return []
  // }
  //
  // return map(result[0].propertyDesignation?.buildings, (building) => {
  //   return {
  //     ...building,
  //     ...result[0].district,
  //   }
  // })

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
