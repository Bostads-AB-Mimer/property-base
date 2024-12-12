import KoaRouter from '@koa/router'
import { openapiSpec } from '../openapi'
import { koaApiReference } from '@scalar/koa-api-reference'

export const routes = (router: KoaRouter) => {
  // Serve the OpenAPI spec as JSON
  router.get('/openapi.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = openapiSpec
  })

  // Mount Scalar UI at the root path
  router.get('/', async (ctx, next) => {
    await koaApiReference({
      spec: {
        url: '/openapi.json'
      },
      page: {
        title: 'Property Base API Reference',
        description: 'API documentation for the Property Base system'
      }
    })(ctx, next)
  })
}
