import KoaRouter from '@koa/router'
import { openapiSpec } from '../openapi'

export const routes = (router: KoaRouter) => {
  router.get('/openapi.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = openapiSpec
  })
}
