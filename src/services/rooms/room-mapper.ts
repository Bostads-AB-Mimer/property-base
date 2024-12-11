import { RoomWithRelations } from '../../adapters/room-adapter'
import { RoomSchema, RoomDetailsSchema } from '../../types/room'
import { toBoolean, trimString } from '../../utils/data-conversion'

export function mapDbToRoom(dbRecord: RoomWithRelations) {
  if (!dbRecord) return null

  return RoomSchema.parse({
    id: dbRecord.id,
    code: dbRecord.roomCode,
    name: dbRecord.name?.trim(),
    _links: {
      self: {
        href: `/rooms/${dbRecord.id}`,
      },
      details: {
        href: `/rooms/${dbRecord.id}/details`,
      },
    },
  })
}

export function mapDbToRoomDetails(dbRecord: RoomWithRelations) {
  if (!dbRecord) return null

  return RoomDetailsSchema.parse({
    id: dbRecord.id,
    code: dbRecord.roomCode,
    name: dbRecord.name?.trim(),
    _links: {
      self: {
        href: `/rooms/${dbRecord.id}`,
      },
      building: {
        href: `/buildings/${dbRecord.buildingCode}`,
      },
      residence: {
        href: `/residences/${dbRecord.residenceCode}`,
      },
      staircase: {
        href: `/staircases/${dbRecord.staircaseCode}`,
      },
    },
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
