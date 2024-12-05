import { RoomWithRelations } from '../../adapters/room-adapter'
import { RoomSchema } from '../../types/room'
import { toBoolean, trimString } from '../../utils/data-conversion'

export function mapDbToRoom(dbRecord: RoomWithRelations) {
  if (!dbRecord) return null

  return RoomSchema.parse({
    id: trimString(dbRecord.roomId) || '',
    code: trimString(dbRecord.roomCode) || '',
    name: trimString(dbRecord.name),
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
    roomType: dbRecord.roomType
      ? {
          roomTypeId: dbRecord.roomType.roomTypeId,
          roomTypeCode: dbRecord.roomType.roomTypeCode,
          name: dbRecord.roomType.name?.trim() || '',
          use: dbRecord.roomType.use,
          optionAllowed: dbRecord.roomType.optionAllowed,
          isSystemStandard: dbRecord.roomType.isSystemStandard,
          allowSmallRoomsInValuation:
            dbRecord.roomType.allowSmallRoomsInValuation,
          timestamp: dbRecord.roomType.timestamp,
        }
      : null,
  })
}
