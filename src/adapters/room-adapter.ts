import { Prisma, PrismaClient, Room } from '@prisma/client'
import { map } from 'lodash'

const prisma = new PrismaClient({})

export type RoomWithRelations = Prisma.RoomGetPayload<{
  include: {
    roomType: true
  }
}>

export const getRooms = async (
  buildingCode: string,
  floorCode: string,
  residenceCode: string
) => {
  const propertyStructures = await prisma.propertyStructure.findMany({
    where: {
      buildingCode: {
        contains: buildingCode,
      },
      floorCode: floorCode,
      residenceCode: residenceCode,
      NOT: {
        floorId: null,
        residenceId: null,
        roomId: null,
      },
      localeId: null,
    },
  })
  
  return rooms.map(mapDbToRoom).filter((r): r is NonNullable<typeof r> => r !== null)

  const rooms = await prisma.room.findMany({
    where: {
      propertyObjectId: {
        in: map(propertyStructures, 'objectId'),
      },
    },
    include: {
      roomType: true,
    },
  })
}
