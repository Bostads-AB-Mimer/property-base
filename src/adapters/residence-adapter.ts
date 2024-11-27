import { Prisma, PrismaClient } from '@prisma/client'

export const getLatestResidences = async (propertyCode?: string) => {
  const where = propertyCode ? {
    propertyObject: {
      property: {
        propertyCode
      }
    }
  } : undefined

  const response = await prisma.residence.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    select: {
      id: true,
      objectId: true,
      propertyObject: {
        select: {
          property: {
            select: {
              id: true,
              code: true,
            },
          },
          building: {
            select: {
              buildingCode: true,
            },
          },
        },
      },
      residenceTypeId: true,
      code: true,
      name: true,
      location: true,
      wheelchairAccessible: true,
      residenceAdapted: true,
      serviceApartment: true,
      balcony1Location: true,
      balcony2Location: true,
      balcony1Type: true,
      balcony2Type: true,
      patioLocation: true,
      hygieneFacility: true,
      sauna: true,
      extraToilet: true,
      sharedKitchen: true,
      petAllergyFree: true,
      electricAllergyIntolerance: true,
      smokeFree: true,
      elevator: true,
      asbestos: true,
      entrance: true,
      hluFundAvailableAmount: true,
      hluFundMaxAmount: true,
      hluDiscountStartDate: true,
      partNo: true,
      part: true,
      deleted: true,
      fromDate: true,
      toDate: true,
      timestamp: true,
      residenceType: {
        select: {
          residenceTypeId: true,
          code: true,
          name: true,
          roomCount: true,
          kitchen: true,
          timestamp: true,
          systemStandard: true,
          checklistId: true,
          componentTypeActionId: true,
          statisticsGroupSCBId: true,
          statisticsGroup2Id: true,
          statisticsGroup3Id: true,
          statisticsGroup4Id: true,
          selectionFundAmount: true,
        },
      },
    },
    take: 10, // Adjust the number of residences to fetch as needed
  })

  return response
}

export type ResidenceWithRelations = Prisma.ResidenceGetPayload<{
  include: {
    residenceType: true
    propertyObject: {
      include: {
        property: true
        building: true
      }
    }
  }
}>

export const getResidenceById = async (
  id: string,
): Promise<ResidenceWithRelations | null> => {
  const response = await prisma.residence.findFirst({
    where: {
      id: id,
    },
    include: {
      residenceType: true,
      propertyObject: {
        include: {
          property: true,
          building: true,
        },
      },
    },
  })

  return response
}

const prisma = new PrismaClient({
  log: ['query'],
})

export const getResidencesByType = async (residenceTypeId: string) => {
  console.log('residenceTypeId', residenceTypeId)
  const response = await prisma.residence.findMany({
    where: {
      residenceTypeId,
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      residenceId: true,
      code: true,
      name: true,
    },
  })

  return response
}

export const getResidencesByBuildingCode = async (buildingCode: string) => {
  const building = await prisma.building.findFirst({
    where: {
      buildingCode: {
        contains: buildingCode,
      }
    },
    select: { name: true },
  })

  if (!building) {
    throw new Error(`Building with code ${buildingCode} not found.`)
  }

  //todo: can there be multiple staircases?
  const staircases =  await prisma.staircase.findMany({
    where: { name: building.name },
  })

  if (!staircases) {
    throw new Error(`Building does not have a related staircase.`)
  }

  return prisma.residence.findMany({
    where: { name: staircases[0].name },
    select: {
      id: true,
      objectId: true,
      residenceTypeId: true,
      code: true,
      name: true,
      location: true,
      wheelchairAccessible: true,
      residenceAdapted: true,
      serviceApartment: true,
      balcony1Location: true,
      balcony2Location: true,
      balcony1Type: true,
      balcony2Type: true,
      patioLocation: true,
      hygieneFacility: true,
      sauna: true,
      extraToilet: true,
      sharedKitchen: true,
      petAllergyFree: true,
      electricAllergyIntolerance: true,
      smokeFree: true,
      elevator: true,
      asbestos: true,
      entrance: true,
      hluFundAvailableAmount: true,
      hluFundMaxAmount: true,
      hluDiscountStartDate: true,
      partNo: true,
      part: true,
      deleted: true,
      fromDate: true,
      toDate: true,
      timestamp: true,
      residenceType: {
        select: {
          residenceTypeId: true,
          code: true,
          name: true,
          roomCount: true,
          kitchen: true,
          selectionFundAmount: true,
        },
      },
    }
  })

}

