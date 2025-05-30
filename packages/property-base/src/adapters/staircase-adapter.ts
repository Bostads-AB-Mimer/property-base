import { map } from 'lodash'
import { toBoolean, trimStrings } from '../utils/data-conversion'

import { prisma } from './db'

//todo: add types

async function getStaircasesByBuildingCode(buildingCode: string) {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      NOT: {
        staircaseId: null,
      },
      residenceId: null,
      localeId: null,
    },
  })

  const staircases = await prisma.staircase.findMany({
    where: {
      propertyObjectId: {
        in: map(propertyStructures, 'propertyObjectId'),
      },
    },
  })

  return staircases.map(trimStrings).map((staircase) => ({
    id: staircase.id,
    code: staircase.code,
    name: staircase.name,
    buildingCode: buildingCode,
    features: {
      floorPlan: staircase.floorPlan,
      accessibleByElevator: toBoolean(staircase.accessibleByElevator),
    },
    dates: {
      from: staircase.fromDate,
      to: staircase.toDate,
    },
    deleted: toBoolean(staircase.deleteMark),
    timestamp: staircase.timestamp,
  }))
}

export { getStaircasesByBuildingCode }
