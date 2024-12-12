import KoaRouter from '@koa/router'
import { swaggerSpec } from '../swagger'

export const routes = (router: KoaRouter) => {
  router.get('/openapi.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = swaggerSpec
  })
}
