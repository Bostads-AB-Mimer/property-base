import { z } from 'zod'

export const RoomTypeSchema = z.object({
  roomTypeId: z.string(),
  roomTypeCode: z.string(),
  name: z.string().nullable(),
  use: z.number(),
  optionAllowed: z.number(),
  isSystemStandard: z.number(),
  allowSmallRoomsInValuation: z.number(),
  timestamp: z.string()
})

export const RoomSchema = z.object({
  roomId: z.string(),
  roomCode: z.string(),
  name: z.string().nullable(),
  sharedUse: z.number(),
  sortingOrder: z.number(),
  allowPeriodicWorks: z.number(),
  spaceType: z.number(),
  hasToilet: z.number(),
  isHeated: z.number(),
  hasThermostatValve: z.number(),
  orientation: z.number(),
  installationDate: z.date().nullable(),
  deleteMark: z.number(),
  fromDate: z.date(),
  toDate: z.date(),
  availableFrom: z.date().nullable(),
  availableTo: z.date().nullable(),
  timestamp: z.string(),
  roomType: RoomTypeSchema.nullable()
})

export const RoomListSchema = z.array(RoomSchema)

export type Room = z.infer<typeof RoomSchema>
export type RoomList = z.infer<typeof RoomListSchema>
