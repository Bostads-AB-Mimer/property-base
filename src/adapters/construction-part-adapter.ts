import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
})

//todo: add types
//todo: rename construction part to building part instead?
export const getConstructionPartsByBuildingCode = async (
  buildingCode: string
) => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      NOT: {
        buildingPartId: null,
      },
      residenceId: null,
      localeId: null,
    },
  })

  return prisma.constructionPart.findMany({
    where: {
      objectId: {
        in: map(propertyStructures, 'objectId'),
      },
    },
    include: {
      constructionPartType: true,
    },
  })
}
