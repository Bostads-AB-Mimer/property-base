import KoaRouter from '@koa/router'
import { openapiSpec } from '../openapi'
import serve from 'koa-static'
import path from 'path'

export const routes = (router: KoaRouter) => {
  // Serve the OpenAPI spec as JSON
  router.get('/openapi.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = openapiSpec
  })

  // Serve static files from the public directory
  router.get('/', serve(path.join(__dirname, '../public')))
}
