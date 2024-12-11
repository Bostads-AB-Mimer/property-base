import { Prisma, PrismaClient, Room } from '@prisma/client'
import { map } from 'lodash'
import { mapDbToRoom } from '../services/rooms/room-mapper'

const prisma = new PrismaClient({})

export type RoomWithRelations = Prisma.RoomGetPayload<{
  include: {
    roomType: true
  }
}>

//todo: add types

//todo: we might be able to skip using floorCode
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

  const rooms = await prisma.room.findMany({
    where: {
      propertyObjectId: {
        in: map(propertyStructures, 'objectId'),
      },
    },
    select: {
      id: true,
      roomCode: true,
      name: true,
      sharedUse: true,
      sortingOrder: true,
      allowPeriodicWorks: true,
      spaceType: true,
      hasToilet: true,
      isHeated: true,
      hasThermostatValve: true,
      orientation: true,
      installationDate: true,
      deleteMark: true,
      fromDate: true,
      toDate: true,
      availableFrom: true,
      availableTo: true,
      timestamp: true,
      roomType: true,
    },
  })

  return rooms.map(mapDbToRoom)
}

export const getRoomById = async (id: string) => {
  return prisma.room.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      roomCode: true,
      name: true,
      sharedUse: true,
      sortingOrder: true,
      allowPeriodicWorks: true,
      spaceType: true,
      hasToilet: true,
      isHeated: true,
      hasThermostatValve: true,
      orientation: true,
      installationDate: true,
      deleteMark: true,
      fromDate: true,
      toDate: true,
      availableFrom: true,
      availableTo: true,
      timestamp: true,
      roomType: true,
    },
  })
}
