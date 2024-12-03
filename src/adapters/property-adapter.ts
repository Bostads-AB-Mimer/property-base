import { PrismaClient, Prisma } from '@prisma/client'

export type PropertyWithObject = Prisma.PropertyGetPayload<{
  include: {
    propertyObject: true
  }
}>

export type PropertyBasicInfo = Prisma.PropertyGetPayload<{
  select: {
    propertyId: true
    propertyCode: true
    tract: true
    propertyDesignation: true
  }
}>

const prisma = new PrismaClient({
  log: ['query'],
})

const getPropertyById = async (
  propertyId: string
): Promise<PropertyWithObject | null> => {
  const response = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    include: {
      propertyObject: {
        select: {
          propertyObjectId: true,
          deleteMark: true,
          timestamp: true,
          objectTypeId: true,
          barcode: true,
          barcodeType: true,
          condition: true,
          conditionInspectionDate: true,
          vatAdjustmentPrinciple: true,
          energyClass: true,
          energyRegistered: true,
          energyReceived: true,
          energyIndex: true,
          heatingNature: true,
        },
      },
    },
  })
  return response
}

const getProperties = async (
  tract: string | undefined
): Promise<PropertyBasicInfo[]> => {
  if (tract) {
    return prisma.property.findMany({
      where: { tract },
      select: {
        propertyId: true,
        propertyCode: true,
        tract: true,
        propertyDesignation: true,
      },
    })
  }
  return prisma.property.findMany({
    select: {
      propertyId: true,
      propertyCode: true,
      tract: true,
      propertyDesignation: true,
    },
  })
}

export { getPropertyById, getProperties }
