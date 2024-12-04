import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient({
  log: ['query'],
})

export type PropertyWithObject = Prisma.PropertyGetPayload<{
  include: {
    propertyObject: true
  }
}>

export type PropertyBasicInfo = Prisma.PropertyGetPayload<{
  select: {
    id: true
    code: true
    tract: true
    propertyDesignation: true
  }
}>

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

//todo: we should not be able to get all properties without querying on company
//todo: find company row in babuf based on result from /companies
// select * from babuf where keycmobj = '_0U70NM2T8' -- find company row in babuf
// select * from cmcmp where keycmobj = '_0U70NM2T8' -- find actual company in cmcmp
const getProperties = async (
  tract: string | undefined
): Promise<PropertyBasicInfo[]> => {
  if (tract) {
    return prisma.property.findMany({
      where: { tract },
      select: {
        id: true,
        code: true,
        tract: true,
        propertyDesignation: true,
      },
    })
  }
  return prisma.property.findMany({
    select: {
      id: true,
      code: true,
      tract: true,
      propertyDesignation: true,
    },
  })
}

export { getPropertyById, getProperties }
