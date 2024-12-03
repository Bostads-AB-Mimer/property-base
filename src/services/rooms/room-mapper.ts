import { Room } from '@prisma/client'
import { RoomSchema } from '../../types/room'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToRoom(dbRecord: Room) {
  if (!dbRecord) return null

  return RoomSchema.parse({
    id: dbRecord.roomId,
    code: dbRecord.roomCode,
    name: dbRecord.name?.trim(),
    usage: {
      shared: toBoolean(dbRecord.sharedUse),
      allowPeriodicWorks: toBoolean(dbRecord.allowPeriodicWorks),
      spaceType: dbRecord.spaceType,
    },
    features: {
      hasToilet: toBoolean(dbRecord.hasToilet),
      isHeated: toBoolean(dbRecord.isHeated),
      hasThermostatValve: toBoolean(dbRecord.hasThermostatValve),
      orientation: dbRecord.orientation,
    },
    dates: {
      installation: dbRecord.installationDate,
      from: dbRecord.fromDate,
      to: dbRecord.toDate,
      availableFrom: dbRecord.availableFrom,
      availableTo: dbRecord.availableTo,
    },
    sortingOrder: dbRecord.sortingOrder,
    deleted: toBoolean(dbRecord.deleteMark),
    timestamp: dbRecord.timestamp,
    roomType: dbRecord.roomType ? {
      roomTypeId: dbRecord.roomType.roomTypeId,
      roomTypeCode: dbRecord.roomType.code,
      name: dbRecord.roomType.name,
      use: dbRecord.roomType.use,
      optionAllowed: dbRecord.roomType.optionAllowed,
      isSystemStandard: dbRecord.roomType.isSystemStandard,
      allowSmallRoomsInValuation: dbRecord.roomType.allowSmallRoomsInValuation,
      timestamp: dbRecord.roomType.timestamp
    } : null
  })
}
