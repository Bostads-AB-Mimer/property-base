/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import { getPlannedMaintenanceByPropertyObjectId } from '../adapters/planned-maintenance-adapter'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Planned Maintenance
 *     description: Operations related to staircases
 */

export const routes = (router: KoaRouter) => {
  //todo: add schema
  /**
   * @swagger
   * /planned-maintenance/{propertyObjectId}:
   *   get:
   *     summary: Gets the planned maintenance on a construction part by property object ID
   *     description: Returns the planned maintenance belonging to a construction part based on property object code.
   *     tags:
   *       - Planned Maintenance
   *     parameters:
   *       - in: path
   *         name: propertyObjectId
   *         required: true
   *         schema:
   *           type: string
   *         description: The property object id of the construction part
   *     responses:
   *       200:
   *         description: Successfully retrieved the planned maintenance
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       500:
   *         description: Internal server error
   */
  router.get('(.*)/planned-maintenance/:propertyObjectId', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    const propertyObjectId = ctx.params.propertyObjectId
    logger.info(`GET /planned-maintenance/${propertyObjectId}`, metadata)

    try {
      const response =
        await getPlannedMaintenanceByPropertyObjectId(propertyObjectId)

      //todo: add hateos links

      ctx.body = {
        content: response,
        ...metadata,
      }
    } catch (err) {
      ctx.status = 500
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      ctx.body = { reason: errorMessage, ...metadata }
    }
  })
}
