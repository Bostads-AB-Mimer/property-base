import { z } from 'zod'

export const ResidenceSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  links: z.object({
    building: z.string().nullable(),
    property: z.string().nullable(),
  }),
  location: z.string().optional(),
  accessibility: z.object({
    wheelchairAccessible: z.boolean(),
    residenceAdapted: z.boolean(),
    elevator: z.boolean(),
  }),
  features: z.object({
    balcony1: z
      .object({
        location: z.string(),
        type: z.string(),
      })
      .optional(),
    balcony2: z
      .object({
        location: z.string(),
        type: z.string(),
      })
      .optional(),
    patioLocation: z.string().optional(),
    hygieneFacility: z.string(),
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
        roomId: z.string(),
        roomCode: z.string(),
        name: z.string().optional(),
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
        timestamp: z.string(),
      })
    )
    .optional()
    .default([]),
  entrance: z.string(),
  partNo: z.number().optional().nullable(),
  part: z.string().optional().nullable(),
  deleted: z.boolean(),
  validityPeriod: z.object({
    fromDate: z.date(),
    toDate: z.date(),
  }),
  residenceType: z.object({
    residenceTypeId: z.string(),
    code: z.string(),
    name: z.string().nullable(),
    roomCount: z.number().nullable(),
    kitchen: z.number(),
    systemStandard: z.number(),
    checklistId: z.string().nullable(),
    componentTypeActionId: z.string().nullable(),
    statisticsGroupSCBId: z.string().nullable(),
    statisticsGroup2Id: z.string().nullable(),
    statisticsGroup3Id: z.string().nullable(),
    statisticsGroup4Id: z.string().nullable(),
    timestamp: z.string(),
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

export type ExternalResidence = z.infer<typeof ResidenceSchema>
export type Residence = ExternalResidence
