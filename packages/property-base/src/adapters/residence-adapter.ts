import { Prisma } from '@prisma/client'
import { map } from 'lodash'
import { logger } from 'onecore-utilities'

import { trimStrings } from '@src/utils/data-conversion'

import { prisma } from './db'

//todo: add types

export type Residence = Prisma.ResidenceGetPayload<{
  select: {
    id: true
    code: true
    name: true
    deleted: true
    fromDate: true
    toDate: true
  }
}>

export type ResidenceWithRelations = Prisma.ResidenceGetPayload<{
  include: {
    residenceType: true
    propertyObject: {
      include: {
        rentalInformation: { include: { rentalInformationType: true } }
        propertyStructures: {
          select: {
            rentalId: true
            propertyCode: true
            propertyName: true
            buildingCode: true
            buildingName: true
          }
        }
      }
    }
    comments: {
      where: {
        template: {
          type: 'balgh'
          caption: 'Anläggningsid'
        }
      }
      select: {
        text: true
      }
    }
  }
}>

const residenceSelect: Prisma.ResidenceSelect = {
  id: true,
  code: true,
  name: true,
  deleted: true,
  fromDate: true,
  toDate: true,
}

export const getResidenceRentalPropertyInfoByRentalId = async (
  rentalId: string
) => {
  const propertyInfo = await prisma.propertyStructure.findFirst({
    where: {
      rentalId,
      propertyObject: { objectTypeId: 'balgh' },
    },
    select: {
      propertyObject: {
        select: {
          id: true,
          rentalInformation: {
            select: {
              apartmentNumber: true,
              rentalInformationType: { select: { name: true, code: true } },
            },
          },
        },
      },
    },
  })

  return trimStrings(propertyInfo)
}

export const getResidenceByRentalId = async (rentalId: string) => {
  const propertyStructure = await prisma.propertyStructure.findFirst({
    where: {
      rentalId,
      propertyObject: { objectTypeId: 'balgh' },
    },
    select: {
      buildingCode: true,
      buildingName: true,
      propertyCode: true,
      propertyName: true,
      propertyId: true,
      buildingId: true,
      propertyObject: {
        select: {
          residence: {
            select: {
              id: true,
              elevator: true,
              deleted: true,
              code: true,
              hygieneFacility: true,
              name: true,
              quantityValues: true,
              residenceType: {
                select: {
                  code: true,
                  name: true,
                  roomCount: true,
                  kitchen: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!propertyStructure) throw 'not-found'
  if (!propertyStructure.propertyObject) throw 'not-found'
  if (!propertyStructure.propertyObject.residence) throw 'not-found'

  const {
    propertyObject: { residence },
  } = propertyStructure

  return trimStrings({ ...propertyStructure, propertyObject: { residence } })
}

export const getResidenceById = async (
  id: string
): Promise<ResidenceWithRelations | null> => {
  const response = await prisma.residence
    .findFirst({
      where: {
        id: id,
      },
      include: {
        residenceType: true,
        propertyObject: {
          include: {
            rentalInformation: { include: { rentalInformationType: true } },
            propertyStructures: {
              select: {
                rentalId: true,
                buildingCode: true,
                buildingName: true,
                propertyCode: true,
                propertyName: true,
              },
            },
          },
        },
        comments: {
          where: {
            template: {
              type: 'balgh',
              caption: 'Anläggningsid',
            },
          },
          select: {
            text: true,
          },
        },
      },
    })
    .then(trimStrings)

  return response
}

export const getResidencesByBuildingCode = async (
  buildingCode: string
): Promise<Residence[]> => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      NOT: {
        staircaseId: null,
        residenceId: null,
      },
      localeId: null,
    },
  })

  return prisma.residence
    .findMany({
      where: {
        propertyObjectId: {
          in: map(propertyStructures, 'propertyObjectId'),
        },
      },
      select: residenceSelect,
    })
    .then(trimStrings)
}

export const getResidencesByBuildingCodeAndStaircaseCode = async (
  buildingCode: string,
  staircaseCode: string
): Promise<Residence[]> => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      staircaseCode: staircaseCode,
      NOT: {
        staircaseId: null,
        residenceId: null,
      },
      localeId: null,
    },
  })

  return prisma.residence
    .findMany({
      where: {
        propertyObjectId: {
          in: map(propertyStructures, 'propertyObjectId'),
        },
      },
    })
    .then(trimStrings)
}

export type ResidenceSearchResult = Prisma.ResidenceGetPayload<{
  include: {
    propertyObject: {
      include: {
        propertyStructures: {
          select: {
            rentalId: true
            propertyCode: true
            propertyName: true
            buildingCode: true
            buildingName: true
          }
        }
      }
    }
  }
}>

export const getResidenceSizeByRentalId = async (rentalId: string) => {
  try {
    // Get property structure information for the residence
    const propertyInfo = await prisma.propertyStructure.findFirst({
      where: {
        rentalId,
        propertyObject: { objectTypeId: 'balgh' },
        NOT: { propertyCode: null },
      },
      select: {
        name: true,
        propertyObject: {
          select: {
            id: true,
          },
        },
      },
    })

    if (propertyInfo === null) {
      logger.warn(
        'residence-adapter.getResidenceSizeByRentalId: No property structure found for rentalId'
      )
      return null
    }

    // Get area size for the property object
    const areaSize = await prisma.quantityValue.findFirst({
      where: {
        code: propertyInfo.propertyObject.id,
        quantityTypeId: 'BOA',
      },
    })

    return areaSize
  } catch (err) {
    logger.error({ err }, 'residence-adapter.getResidenceSizeById')
    throw err
  }
}

export const searchResidences = async (
  q: string
): Promise<Array<ResidenceSearchResult>> => {
  try {
    const result = await prisma.residence.findMany({
      where: {
        propertyObject: {
          propertyStructures: { every: { rentalId: { contains: q } } },
        },
      },
      include: {
        propertyObject: {
          include: {
            propertyStructures: {
              select: {
                rentalId: true,
                propertyCode: true,
                propertyName: true,
                buildingCode: true,
                buildingName: true,
              },
              where: {
                NOT: {
                  rentalId: null,
                  propertyCode: null,
                  propertyName: null,
                  buildingCode: null,
                  buildingName: null,
                },
              },
            },
          },
        },
      },
    })

    return trimStrings(result)
  } catch (err) {
    logger.error({ err }, 'residence-adapter.searchResidences')
    throw err
  }
}
