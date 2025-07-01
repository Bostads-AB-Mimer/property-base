import { trimStrings } from '@src/utils/data-conversion'
import { prisma } from './db'

export const getMaintenanceUnitsByRentalId = async (rentalId: string) => {
  /**
   *  Get property structure info for the given rental ID
   *  In order to extract propertyObjectId and other details used in response
   */
  const rentalPropertyInfo = await prisma.propertyStructure.findFirst({
    select: {
      rentalId: true,
      propertyCode: true,
      propertyName: true,
      propertyObjectId: true,
    },
    where: {
      rentalId: rentalId,
      roomCode: null,
      NOT: {
        propertyCode: null,
        propertyName: null,
        buildingCode: null,
        buildingName: null,
      },
    },
  })

  if (!rentalPropertyInfo) {
    console.error(`No property found for rental ID: ${rentalId}`)
    return []
  }

  // Grab related maintenance units with propertyObjectId
  const rentalPropertyToMaintenanceUnit =
    await prisma.residenceToMaintenanceUnitRelation.findMany({
      include: {
        maintenanceUnit: {
          include: {
            maintenanceUnitType: true,
          },
        },
      },
      where: {
        residencePropertyObjectId: rentalPropertyInfo.propertyObjectId,
      },
    })

  // Trim strings and map the results to the desired structure
  const rentalPropertyInfoTrimmed = trimStrings(rentalPropertyInfo)
  const maintenanceUnitPropertyStructuresMapped = trimStrings(
    rentalPropertyToMaintenanceUnit
  ).map((item) => {
    return {
      id: item?.maintenanceUnit?.id,
      rentalPropertyId: rentalPropertyInfoTrimmed.rentalId,
      code: item.maintenanceUnit?.code,
      caption: item?.maintenanceUnit?.name,
      type: item.maintenanceUnit?.maintenanceUnitType?.name,
      propertyCode: rentalPropertyInfoTrimmed.propertyCode,
      propertyName: rentalPropertyInfoTrimmed.propertyName,
    }
  })

  return maintenanceUnitPropertyStructuresMapped
}

export const getMaintenanceUnitsByPropertyCode = async (
  propertyCode: string
) => {
  const propertyInfo = await prisma.propertyStructure.findFirst({
    select: {
      propertyId: true,
      propertyCode: true,
      propertyName: true,
      propertyObjectId: true,
    },
    where: {
      propertyCode: propertyCode,
      roomCode: null,
      NOT: {
        propertyCode: null,
        propertyName: null,
        buildingCode: null,
        buildingName: null,
      },
    },
  })

  if (!propertyInfo) {
    console.error(`No property found for property code: ${propertyCode}`)
    return []
  }

  const maintenanceUnits = await prisma.maintenanceUnit.findMany({
    include: {
      maintenanceUnitType: true,
    },
    where: {
      propertyStructures: {
        some: {
          propertyCode: propertyCode,
        },
      },
    },
  })

  const propertyInfoTrimmed = trimStrings(propertyInfo)
  const maintenanceUnitPropertyStructuresMapped = trimStrings(
    maintenanceUnits
  ).map((item) => {
    return {
      id: item.id,
      code: item.code,
      caption: item.name,
      type: item.maintenanceUnitType?.name,
      propertyCode: propertyInfoTrimmed.propertyCode,
      propertyName: propertyInfoTrimmed.propertyName,
    }
  })

  return maintenanceUnitPropertyStructuresMapped
}
