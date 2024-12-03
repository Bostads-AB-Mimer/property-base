import { Prisma, PrismaClient, Room } from '@prisma/client'
import { map } from 'lodash'
import { mapDbToRoom } from '../services/rooms/room-mapper'

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

  return prisma.room.findMany({
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
