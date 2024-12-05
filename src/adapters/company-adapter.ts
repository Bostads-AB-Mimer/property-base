import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
})

export const getCompanies = async () => {
  return prisma.company.findMany({
    select: {
      id: true,
      propertyObjectId: true,
      code: true,
      name: true,
      organizationNumber: true,
    },
  })
}

export const getCompany = async (id: string) => {
  return prisma.company.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      systemCompanyId: true,
      databaseId: true,
      propertyObjectId: true,
      code: true,
      name: true,
      organizationNumber: true,
      internalExternal: true,
      phone: true,
      fTax: true,
      cooperativeHousingAssociation: true,
      differentiatedAdditionalCapital: true,
      rentAdministered: true,
      blocked: true,
      rentDaysPerMonth: true,
      economicPlanApproved: true,
      vatObligationPercent: true,
      vatRegistered: true,
      energyOptimization: true,
      ownedCompany: true,
      interestInvoice: true,
      errorReportAdministration: true,
      mediaBilling: true,
      ownResponsibilityForInternalMaintenance: true,
      subletPercentage: true,
      subletFeeAmount: true,
      disableQuantitiesBelowCompany: true,
      timestamp: true,
    },
  })

  //todo: return with mapper?
}
