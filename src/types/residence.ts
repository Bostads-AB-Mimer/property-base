import { z } from 'zod'
import {
  BaseBasicSchema,
  TimestampSchema,
  ValidityPeriodSchema,
} from './shared'

export const residencesQueryParamsSchema = z.object({
  buildingCode: z
    .string()
    .min(7, { message: 'buildingCode must be at least 7 characters long.' }),
  floorCode: z.string().optional(),
})

export const ResidenceSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  links: z
    .object({
      self: z.object({
        href: z.string().trim().describe('URI to the residence resource'),
      }),
      building: z.object({
        href: z.string().trim().describe('URI to the associated building'),
      }),
      property: z.object({
        href: z.string().trim().describe('URI to the associated property'),
      }),
    })
    .describe('HATEOAS links for resource navigation'),
  location: z.string().trim().optional(),
  accessibility: z.object({
    wheelchairAccessible: z.boolean(),
    residenceAdapted: z.boolean(),
    elevator: z.boolean(),
  }),
  features: z.object({
    balcony1: z
      .object({
        location: z.string().trim(),
        type: z.string().trim(),
      })
      .optional(),
    balcony2: z
      .object({
        location: z.string().trim(),
        type: z.string().trim(),
      })
      .optional(),
    patioLocation: z.string().trim().optional(),
    hygieneFacility: z.string().trim(),
    sauna: z.boolean(),
    extraToilet: z.boolean(),
    sharedKitchen: z.boolean(),
    petAllergyFree: z.boolean(),
    electricAllergyIntolerance: z
      .boolean()
      .describe('Is the apartment checked for electric allergy intolerance?'),
    smokeFree: z.boolean(),
    asbestos: z.boolean(),
  }),
  rooms: z
    .array(
      z.object({
        roomId: z.string().trim(),
        roomCode: z.string().trim(),
        name: z.string().trim().optional(),
        sharedUse: z.boolean(),
        sortingOrder: z.number(),
        allowPeriodicWorks: z.boolean(),
        spaceType: z.number(),
        hasToilet: z.boolean(),
        isHeated: z.number(),
        hasThermostatValve: z.boolean(),
        orientation: z.number(),
        installationDate: z.date().optional(),
        deleteMark: z.boolean(),
        fromDate: z.date(),
        toDate: z.date(),
        availableFrom: z.date().optional(),
        availableTo: z.date().optional(),
        timestamp: z.string().trim(),
      })
    )
    .optional()
    .default([]),
  entrance: z.string().trim(),
  partNo: z.number().optional().nullable(),
  part: z.string().trim().optional().nullable(),
  deleted: z.boolean(),
  validityPeriod: z.object({
    fromDate: z.date(),
    toDate: z.date(),
  }),
  residenceType: z.object({
    residenceTypeId: z.string().trim(),
    code: z.string().trim(),
    name: z.string().trim().nullable(),
    roomCount: z.number().nullable(),
    kitchen: z.number(),
    systemStandard: z.number(),
    checklistId: z.string().trim().nullable(),
    componentTypeActionId: z.string().trim().nullable(),
    statisticsGroupSCBId: z.string().trim().nullable(),
    statisticsGroup2Id: z.string().trim().nullable(),
    statisticsGroup3Id: z.string().trim().nullable(),
    statisticsGroup4Id: z.string().trim().nullable(),
    timestamp: z.string().trim(),
  }),
  propertyObject: z.object({
    energy: z.object({
      energyClass: z.number(),
      energyRegistered: z.date().optional(),
      energyReceived: z.date().optional(),
      energyIndex: z.number().optional(),
    }),
  }),
})

export type Residence = z.infer<typeof ResidenceSchema>

export const ResidenceBasicInfoSchema = z.object({
  id: z.string().trim(),
  code: z.string().trim(),
  name: z.string().trim(),
  _links: z.object({
    self: z.object({
      href: z.string().trim(),
    }),
  }),
})

export type ResidenceBasicInfo = z.infer<typeof ResidenceBasicInfoSchema>
