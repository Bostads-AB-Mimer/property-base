/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import { z } from 'zod'

import { etagMiddleware } from '../middleware/etag'
import {
  getProperties,
  getPropertyById,
  searchProperties,
} from '../adapters/property-adapter'
import {
  propertiesQueryParamsSchema,
  PropertyDetailsSchema,
  PropertySchema,
} from '../types/property'
import { parseRequest } from '../middleware/parse-request'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Properties
 *     description: Operations related to properties
 */
export const routes = (router: KoaRouter) => {
  router.use(etagMiddleware())
  /**
   * @swagger
   * /properties:
   *   get:
   *     summary: Get a list of all properties belonging to a company
   *     description: |
   *       Retrieves a list of all real estate properties belonging to a specific company.
   *       Can be filtered by tract if provided. Returns basic property information
   *       including property ID, code, tract, and designation.
   *     tags:
   *       - Properties
   *     parameters:
   *       - in: query
   *         name: companyCode
   *         required: true
   *         schema:
   *           type: string
   *         description: The code of the company that owns the properties.
   *       - in: query
   *         name: tract
   *         schema:
   *           type: string
   *         description: Optional filter to get properties in a specific tract.
   *     responses:
   *       200:
   *         description: Successfully retrieved list of properties.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Property'
   *       400:
   *         description: Invalid query parameters.
   *       500:
   *         description: Internal server error.
   */
  router.get(
    '(.*)/properties',
    parseRequest({ query: propertiesQueryParamsSchema }),
    async (ctx) => {
      const { companyCode, tract } = ctx.request.parsedQuery

      const metadata = generateRouteMetadata(ctx)
      logger.info(
        `GET /properties?companyCode=${companyCode}&tract=${tract}`,
        metadata
      )

      try {
        const properties = await getProperties(companyCode, tract)

        const responseContent = properties
        ctx.body = {
          content: responseContent,
        }
      } catch (err) {
        ctx.status = 500
        const errorMessage =
          err instanceof Error ? err.message : 'unknown error'
        ctx.body = { reason: errorMessage, ...metadata }
      }
    }
  )

  /**
   * @swagger
   * /properties/search:
   *   get:
   *     summary: Search properties
   *     description: |
   *       Retrieves a list of all real estate properties by name.
   *     tags:
   *       - Properties
   *     parameters:
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         description: The search query.
   *     responses:
   *       200:
   *         description: Successfully retrieved list of properties.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Property'
   *       400:
   *         description: Invalid query parameters.
   *       500:
   *         description: Internal server error.
   */
  const PropertySearchQueryParamsSchema = z.object({
    q: z.string().min(3),
  })

  router.get(
    '(.*)/properties/search',
    parseRequest({ query: PropertySearchQueryParamsSchema }),
    async (ctx) => {
      const metadata = generateRouteMetadata(ctx)
      const { q } = ctx.request.parsedQuery

      try {
        const properties = await searchProperties(q)

        const responseContent = properties.map(
          (p): z.infer<typeof PropertySchema> => ({
            id: p.id,
            code: p.code,
            designation: p.designation ?? '',
            tract: p.tract ?? '',
            municipality: p.municipality ?? '',
            block: p.block ?? '',
            sector: p.sector,
            propertyIndexNumber: p.propertyIndexNumber,
            congregation: p.congregation ?? '',
            builtStatus: p.builtStatus,
            separateAssessmentUnit: p.separateAssessmentUnit,
            consolidationNumber: p.consolidationNumber ?? '',
            ownershipType: p.ownershipType,
            registrationDate: p.registrationDate?.toISOString() ?? null,
            acquisitionDate: p.acquisitionDate?.toISOString() ?? null,
            isLeasehold: p.isLeasehold,
            area: p.area ?? '',
            purpose: p.purpose ?? '',
            buildingType: p.buildingType ?? '',
            propertyTaxNumber: p.propertyTaxNumber ?? '',
            mainPartAssessedValue: p.mainPartAssessedValue,
            includeInAssessedValue: p.includeInAssessedValue,
            grading: p.grading,
            deleteMark: p.deleteMark,
            fromDate: p.fromDate,
            toDate: p.toDate,
            timestamp: p.timestamp,
            propertyObjectId: p.propertyObjectId,
            marketAreaId: p.marketAreaId ?? '',
            districtId: p.districtId ?? '',
            propertyDesignationId: p.propertyDesignationId ?? '',
            valueAreaId: p.valueAreaId,
            leaseholdTerminationDate:
              p.leaseholdTerminationDate?.toISOString() ?? null,
          })
        )

        ctx.body = {
          content: responseContent,
          ...metadata,
        }
      } catch (err) {
        ctx.status = 500
        const errorMessage =
          err instanceof Error ? err.message : 'unknown error'
        ctx.body = { reason: errorMessage, ...metadata }
      }
    }
  )

  /**
   * @swagger
   * /properties/{id}:
   *   get:
   *     summary: Get detailed information about a specific property
   *     description: |
   *       Retrieves comprehensive information about a real estate property using its unique identifier.
   *       Returns detailed property information including property code, tract, designation,
   *       and associated property objects.
   *     tags:
   *       - Properties
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the property.
   *     responses:
   *       200:
   *         description: Successfully retrieved the property.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   $ref: '#/components/schemas/PropertyDetails'
   *       404:
   *         description: Property not found
   *       500:
   *         description: Internal server error
   */
  router.get('(.*)/properties/:id', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    const id = ctx.params.id
    logger.info(`GET /properties/${id}`, metadata)

    try {
      const property = await getPropertyById(id)

      if (!property) {
        ctx.status = 404
        return
      }

      ctx.body = {
        content: PropertyDetailsSchema.parse(property),
        ...metadata,
      }
    } catch (err) {
      ctx.status = 500
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      ctx.body = { reason: errorMessage, ...metadata }
    }
  })
}
