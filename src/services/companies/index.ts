/**
 * All adapters such as database clients etc. should go into subfolders of the service,
 * not in a general top-level adapter folder to avoid service interdependencies (but of
 * course, there are always exceptions).
 */
import KoaRouter from '@koa/router'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import { getProperties, getPropertyById } from '../../adapters/property-adapter'
import { generateMetaLinks } from '../../utils/links'
import { getCompanies } from '../../adapters/company-adapter'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Companies
 *     description: Operations related to companies
 */
export const routes = (router: KoaRouter) => {
  //todo: fix docs
  /**
   * @swagger
   * /companies/:
   *   get:
   *     summary: Get a list of all companies
   *     description: |
   *       Retrieves a list of all companies in the system.
   *       Returns the base company information
   *     tags:
   *       - Companies
   *     responses:
   *       200:
   *         description: Successfully retrieved list of companies
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 content:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Company'
   *       500:
   *         description: Internal server error
   */
  router.get('(.*)/companies/', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    logger.info('GET /companies', metadata)
    const response = await getCompanies()
    ctx.body = {
      content: response.map((company) => ({
        ...company,
        _links: {
          self: {
            href: `/companies/${company.id}`, //todo: create route
          },
        },
      })),
      ...metadata,
      _links: generateMetaLinks(ctx, '/companies'),
    }
  })
}
