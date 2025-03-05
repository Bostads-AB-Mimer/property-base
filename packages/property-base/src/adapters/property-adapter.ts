import { PrismaClient, Prisma } from '@prisma/client'
import { map } from 'lodash'
import { z } from 'zod'
const prisma = new PrismaClient({})

export type PropertyWithObject = Prisma.PropertyGetPayload<{
  include: {
    propertyObject: true
  }
}>
//todo: use actual type and mapper
const getPropertyById = async (
  id: string
): Promise<PropertyWithObject | null> => {
  const response = await prisma.property.findUnique({
    where: {
      id: id,
    },
    include: {
      propertyObject: {
        select: {
          id: true,
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

export type Property = Prisma.PropertyStructureGetPayload<{
  select: {
    id: true
    companyId: true
    companyName: true
    name: true
    code: true
    tract: true
    propertyId: true
  }
}>

//todo: use actual type and mapper
const getProperties = async (
  companyCode: string,
  tract: string | undefined
): Promise<any[]> => {
  const whereClause: Record<string, any> = {
    companyCode,
    propertyId: { not: null },
    buildingId: null,
    managementUnitId: null,
    landAreaId: null,
    roomId: null,
    maintenanceUnitId: null,
    systemId: null,
  }

  if (tract) {
    whereClause.name = { contains: tract }
  }

  const propertyStructures = await prisma.propertyStructure.findMany({
    where: whereClause,
  })

  return prisma.property.findMany({
    where: {
      propertyObjectId: {
        in: map(propertyStructures, 'propertyObjectId'),
      },
    },
  })
}

const PropertySearchResult = z.object({
  type: z.literal('property'),
  id: z.string(),
  name: z.string(),
})

const BuildingSearchResult = z.object({
  type: z.literal('building'),
  id: z.string(),
  name: z.string(),
  propertyId: z.string(),
  propertyName: z.string(),
})

const SearchResultSchema = z.discriminatedUnion('type', [
  PropertySearchResult,
  BuildingSearchResult,
])

type SearchResult = z.infer<typeof SearchResultSchema>

const searchProperties = async (
  companyCode: string,
  q: string
): Promise<SearchResult[]> => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      companyCode,
      propertyId: { not: null },
      buildingId: null,
      managementUnitId: null,
      landAreaId: null,
      roomId: null,
      maintenanceUnitId: null,
      systemId: null,
    },
    select: {
      propertyObjectId: true,
    },
  })

  const properties = await prisma.property.findMany({
    where: {
      propertyObjectId: {
        in: map(propertyStructures, 'propertyObjectId'),
      },
      designation: { contains: q },
    },
    select: {
      id: true,
      designation: true,
    },
  })

  const buildingStructures = await prisma.building.findMany({
    where: {
      companyCode,
      buildingId: { not: null },
      name: { contains: q },
    },
    select: {
      buildingId: true,
      name: true,
      propertyObject: {
        select: {
          id: true,
          designation: true,
        },
      },
    },
    include: { propertyObject: true },
  })

  const results: SearchResult[] = [
    ...properties.map((p) => ({
      type: 'property' as const,
      id: p.id,
      name: p.designation || '',
    })),
    ...buildingStructures.map((b) => ({
      type: 'building' as const,
      id: b.buildingId!,
      name: b.name,
      propertyId: b.property.id,
      propertyName: b.property.designation || '',
    })),
  ]

  return results
}

export { getPropertyById, getProperties, searchProperties }
