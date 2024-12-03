import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'
import { mapDbToStaircase } from '../services/staircases/staircase-mapper'

const prisma = new PrismaClient({})

async function getStaircasesByBuildingCode(buildingCode: string) {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      NOT: {
        floorId: null,
      },
      residenceId: null,
      localeId: null,
    },
  })

  const staircases = await prisma.staircase.findMany({
    where: {
      objectID: {
        in: map(propertyStructures, 'objectId'),
      },
    },
  })

  return staircases.map(mapDbToStaircase)
}

export { getStaircasesByBuildingCode }
