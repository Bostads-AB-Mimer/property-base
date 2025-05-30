/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import {
  ConstructionPartSchema,
  constructionPartsQueryParamsSchema,
} from '../types/construction-parts'
import { getConstructionPartsByBuildingCode } from '../adapters/construction-part-adapter'
import { parseRequest } from '../middleware/parse-request'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Construction parts
 *     description: Operations related to construction parts
 */

export const routes = (router: KoaRouter) => {
  /**
   * @swagger
   * /construction-parts:
   *   get:
   *     summary: Gets construction parts belonging to a building by building code
   *     description: Returns the construction parts belonging to the building.
   *     tags:
   *       - Construction parts
   *     parameters:
   *       - in: query
   *         name: buildingCode
   *         required: true
   *         schema:
   *           type: string
   *         description: The building code of the building.
   *     responses:
   *       200:
   *         description: Successfully retrieved the construction parts.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ConstructionPart'
   *       400:
   *         description: Invalid query parameters.
   *       500:
   *         description: Internal server error.
   */
  router.get(
    ['(.*)/construction-parts', '(.*)/construction-parts/'],
    parseRequest({ query: constructionPartsQueryParamsSchema }),
    async (ctx) => {
      const { buildingCode } = ctx.request.parsedQuery

      const metadata = generateRouteMetadata(ctx)
      logger.info(
        `GET /construction-parts?buildingCode=${buildingCode}`,
        metadata
      )

      try {
        const response = await getConstructionPartsByBuildingCode(buildingCode)
        const responseContent = ConstructionPartSchema.array().parse(response)

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
}
