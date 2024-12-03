import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'
import { toBoolean } from '../utils/data-conversion'

const prisma = new PrismaClient({
  log: ['query'],
})

const getBuildings = async (propertyCode: string) => {
  const result = await prisma.property.findMany({
    where: {
      propertyCode,
    },
    include: {
      propertyDesignation: true,
      district: true
    },
  })

  if (!result[0]) {
    return []
  }

  return map(result[0]?.propertyDesignation?.Building, (building) => ({
    id: building.id,
    code: building.buildingCode,
    name: building.name,
    construction: {
      constructionYear: building.constructionYear,
      renovationYear: building.renovationYear,
      valueYear: building.valueYear,
    },
    features: {
      heating: building.heating,
      fireRating: building.fireRating,
    },
    insurance: {
      class: building.insuranceClass,
      value: building.insuranceValue,
    },
    deleted: toBoolean(building.deleteMark),
    district: {
      code: result[0].district.code,
      name: result[0].district.caption,
    },
  }))
}

const getBuildingByCode = async (buildingCode: string) => {
  const building = await prisma.building.findFirst({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
    },
    include: {
      buildingType: true,
      propertyDesignation: true,
      district: true,
    },
  })

  if (!building) return null

  return {
    id: building.id,
    code: building.buildingCode,
    name: building.name,
    construction: {
      constructionYear: building.constructionYear,
      renovationYear: building.renovationYear,
      valueYear: building.valueYear,
    },
    features: {
      heating: building.heating,
      fireRating: building.fireRating,
    },
    insurance: {
      class: building.insuranceClass,
      value: building.insuranceValue,
    },
    deleted: toBoolean(building.deleteMark),
    buildingType: building.buildingType,
    marketArea: building.marketArea,
    propertyDesignation: building.propertyDesignation,
    district: {
      code: building.district.code,
      name: building.district.caption,
    },
  }
}

export { getBuildings, getBuildingByCode }
