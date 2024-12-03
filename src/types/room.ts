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
  id: z.string().describe('Unique identifier for the room'),
  code: z.string().describe('Room code used in the system'),
  name: z.string().nullable().describe('Display name of the room'),
  _links: z.object({
    self: z.object({
      href: z.string().describe('URI to the room resource'),
    }),
    building: z.object({
      href: z.string().describe('URI to the associated building'),
    }),
    residence: z.object({
      href: z.string().describe('URI to the associated residence'),
    }),
    staircase: z.object({
      href: z.string().describe('URI to the associated staircase'),
    }),
  }).describe('HATEOAS links for resource navigation'),
  usage: z.object({
    shared: z.boolean(),
    allowPeriodicWorks: z.boolean(),
    spaceType: z.number(),
  }),
  features: z.object({
    hasToilet: z.boolean(),
    isHeated: z.boolean(),
    hasThermostatValve: z.boolean(),
    orientation: z.number(),
  }),
  dates: z.object({
    installation: z.date().nullable(),
    from: z.date(),
    to: z.date(),
    availableFrom: z.date().nullable(),
    availableTo: z.date().nullable(),
  }),
  sortingOrder: z.number(),
  deleted: z.boolean(),
  timestamp: z.string(),
  roomType: RoomTypeSchema.nullable()
})

export type Room = z.infer<typeof RoomSchema>
