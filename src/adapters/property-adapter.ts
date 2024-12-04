import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient({
  log: ['query'],
})

export type PropertyWithObject = Prisma.PropertyGetPayload<{
  include: {
    propertyObject: true
  }
}>

export type PropertyBasicInfo = Prisma.PropertyStructureGetPayload<{
  select: {
    id: true
    companyId: true
    companyName: true
    name: true
    code: true
  }
}>

//todo: rewrite this to use property code instead of id
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

//query to get all properties for a company based on company primary key
// select * from babuf where cmpcode = '001' and
// keyobjfst is not null and
// keyobjbyg is null and
// keyobjfen is null and
// keyobjyta is null and
// keyobjrum is null and
// keyobjuhe is null and
// keyobjsys is null
const getProperties = async (
  companyCode: string,
  tract: string | undefined
): Promise<PropertyBasicInfo[]> => {
  // ideally we would like to look up every actual property
  // but that would require a join with bafst based on the result of below query
  // the join would be performed on keyobjfst
  // we could then get the actual property data from bafst
  if (tract) {
    return prisma.propertyStructure.findMany({
      where: {
        name: { contains: tract },
        companyCode: companyCode,
        propertyId: { not: null },
        buildingId: null,
        managementUnitId: null,
        landAreaId: null,
        roomId: null,
        maintenanceUnitId: null,
        systemId: null,
      },
      select: {
        id: true,
        companyId: true,
        companyName: true,
        name: true,
        code: true,
      },
    })
  }
  return prisma.propertyStructure.findMany({
    where: {
      companyCode: companyCode,
      propertyId: { not: null },
      buildingId: null,
      managementUnitId: null,
      landAreaId: null,
      roomId: null,
      maintenanceUnitId: null,
      systemId: null,
    },
    select: {
      id: true,
      companyId: true,
      companyName: true,
      name: true,
      code: true,
    },
  })
}

export { getPropertyById, getProperties }
