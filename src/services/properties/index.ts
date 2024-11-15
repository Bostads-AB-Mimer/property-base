/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import {
  getBuildings,
  getProperties,
  getPropertyById
} from '../../adapters/property-adapter'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Property base service
 *     description: Operations related to property base
 */
export const routes = (router: KoaRouter) => {
  /**
   * @swagger
   * /properties/{id}/:
   *   get:
   *     summary: Get a real estate property by ID
   *     description: Returns the property.
   *     tags:
   *       - Property base service
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
   */
  router.get('(.*)/properties/:id/', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    logger.info('GET /properties/:id/', metadata)
    const response = await getPropertyById(ctx.params.id)
    ctx.body = { content: response, ...metadata }
  })

  /**
   * @swagger
   * /properties:
   *   get:
   *     summary: Gets all real estate properties
   *     description: Returns the property.
   *     tags:
   *       - Property base service
   *     parameters:
   *       - in: query
   *         name: tract
   *         schema:
   *           type: string
   *         description: Filter properties by tract.
   *     responses:
   *       200:
   *         description: Successfully retrieved the properties.
   *         content:
   */
  router.get('(.*)/properties', async (ctx) => {
    let query = undefined
    if(ctx.query.tract ){
      query = ctx.query.tract.toString()
    }

    const metadata = generateRouteMetadata(ctx);
    logger.info('GET /properties', metadata)
    const response = await getProperties(query)
    ctx.body = { content: response, ...metadata }
  })

  /**
   * @swagger
   * /buildings/{propertyCode}/:
   *   get:
   *     summary: Get a building by property code
   *     description: Returns the buildings belonging to the property.
   *     tags:
   *       - Property base service
   *     parameters:
   *       - in: path
   *         name: propertyCode
   *         required: true
   *         schema:
   *           type: string
   *         description: The code of the property.
   *     responses:
   *       200:
   *         description: Successfully retrieved the buildings.
   *         content:
   */
  router.get('(.*)/buildings/:propertyCode/', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    logger.info('GET /building/:propertyId/', metadata)
    const response = await getBuildings(ctx.params.propertyCode)
    ctx.body = { content: response, ...metadata }
  })

  /**
   * @swagger
   * /propertyStructure/{id}/:
   *   get:
   *     summary: Get a real estate property by ID
   *     description: Returns the property.
   *     tags:
   *       - Property base service
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
   */
  router.get('(.*)/propertyStructure/:propertyId/', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    logger.info('GET /building/:propertyId/', metadata)
    const response = await getBuildings(ctx.params.propertyId)
    ctx.body = { content: response, ...metadata }
  })
}
