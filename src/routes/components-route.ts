/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import { getComponentById, getComponents } from '../adapters/component-adapter'
import { componentsQueryParamsSchema } from '../types/component'
import { generateMetaLinks } from '../utils/links'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Components
 *     description: Operations related to components
 */
export const routes = (router: KoaRouter) => {
  router.get('(.*)/components', async (ctx) => {
    const queryParams = componentsQueryParamsSchema.safeParse(ctx.query)

    if (!queryParams.success) {
      ctx.status = 400
      ctx.body = { errors: queryParams.error.errors }
      return
    }

    const { buildingCode, floorCode, residenceCode, roomCode } =
      queryParams.data

    const metadata = generateRouteMetadata(ctx)
    logger.info(
      `GET /rooms?buildingCode=${buildingCode}&floorCode=${floorCode}&residenceCode=${residenceCode}&roomCode=${roomCode}`,
      metadata
    )

    try {
      const rooms = await getComponents(
        buildingCode,
        floorCode,
        residenceCode,
        roomCode
      )
      //todo: add links
      ctx.body = {
        content: rooms,
        ...metadata,
      }
    } catch (err) {
      ctx.status = 500
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      ctx.body = { reason: errorMessage, ...metadata }
    }
  })

  //todo: use correct type in schema
  /**
   * @swagger
   * /components/{id}:
   *   get:
   *     summary: Get a component by ID
   *     description: Returns a component with the specified ID
   *     tags:
   *       - Components
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the component
   *     responses:
   *       200:
   *         description: Successfully retrieved the component
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Component'
   *       404:
   *         description: Component not found
   *       500:
   *         description: Internal server error
   */
  router.get('(.*)/components/:id', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    const id = ctx.params.id
    logger.info(`GET /components/${id}`, metadata)

    try {
      const component = await getComponentById(id)
      if (!component) {
        ctx.status = 404
        return
      }

      //todo: add links
      ctx.body = {
        content: component,
        ...metadata,
        _links: generateMetaLinks(ctx, '/components', {
          id: ctx.params.response,
        }),
      }
    } catch (err) {
      ctx.status = 500
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      ctx.body = { reason: errorMessage, ...metadata }
    }
  })
}
