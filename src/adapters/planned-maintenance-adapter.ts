import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

//todo: add types
//todo: add mapper

export const getPlannedMaintenanceByPropertyObjectId = async (
  propertyObjectID: string
) => {
  const plannedMaintenance = await prisma.plannedMaintenance.findMany({
    where: {
      propertyObjectId: propertyObjectID,
    },
    include: {
      maintenanceAction: true,
    },
  })

  return plannedMaintenance
}
