import { z } from 'zod'

// Common schema patterns used across entities
export const LinksSchema = z.object({
  self: z.object({
    href: z.string().trim().describe('URI to the resource'),
  }),
})

export const TimestampSchema = z.object({
  timestamp: z.string().trim(),
})

export const ValidityPeriodSchema = z.object({
  fromDate: z.date(),
  toDate: z.date(),
})

// Base schema that all basic schemas extend
export const BaseBasicSchema = z.object({
  id: z.string().trim(),
  code: z.string().trim(),
  name: z.string().trim(),
  _links: LinksSchema,
})
