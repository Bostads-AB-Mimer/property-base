import { z } from 'zod'

export const PropertySchema = z.object<z.ZodRawShape>({
  propertyId: z.string(),
  propertyCode: z.string(),
  tract: z.string(),
  propertyDesignation: z.string(),
  _links: z.object({
    self: z.object({
      href: z.string(),
    }),
  }),
})

export type Property = z.infer<typeof PropertySchema>
