import { map } from 'lodash'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
})

const getCompanies = async () => {
  return prisma.company.findMany({
    select: {
      id: true,
      systemCompanyId: true,
      databaseId: true,
      propertyObjectId: true,
      code: true,
      name: true,
      organizationNumber: true,
      internalExternal: true,
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

export { getCompanies }
