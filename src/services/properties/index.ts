/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import { mapDbToProperty } from './property-mapper'
import { getProperties, getPropertyById } from '../../adapters/property-adapter'
import { generateMetaLinks } from '../../utils/links'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Properties
 *     description: Operations related to properties
 */
export const routes = (router: KoaRouter) => {
  /**
   * @swagger
   * /properties/{id}/:
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
   *         description: The ID of the rental property.
   *     responses:
   *       200:
   *         description: Successfully retrieved the property.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   $ref: '#/components/schemas/Property'
   */
  router.get(['(.*)/properties/:id', '(.*)/properties/:id/'], async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    logger.info('GET /properties/:id/', metadata)
    const dbRecord = await getPropertyById(ctx.params.id)
    if (!dbRecord) {
      ctx.status = 404
      return
    }
    const response = mapDbToProperty(dbRecord)
    ctx.body = {
      content: response,
      ...metadata
    }
  })

  /**
   * @swagger
   * /properties/:
   *   get:
   *     summary: Get a list of all real estate properties
   *     description: |
   *       Retrieves a list of all real estate properties in the system.
   *       Can be filtered by tract if provided. Returns basic property information
   *       including property ID, code, tract, and designation.
   *     tags:
   *       - Properties
   *     parameters:
   *       - in: query
   *         name: tract
   *         schema:
   *           type: string
   *         description: Optional filter to get properties in a specific tract
   *     responses:
   *       200:
   *         description: Successfully retrieved list of properties
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Property'
   *       500:
   *         description: Internal server error
   */
  router.get(['(.*)/properties', '(.*)/properties/'], async (ctx) => {
    let query = ctx.query.tract?.toString()

    const metadata = generateRouteMetadata(ctx)
    logger.info('GET /properties', metadata)
    const dbRecords = await getProperties(query)
    const response = dbRecords.map(mapDbToProperty).filter((p): p is NonNullable<typeof p> => p !== null)
    ctx.body = {
      content: response,
      ...metadata
    }
  })
}
