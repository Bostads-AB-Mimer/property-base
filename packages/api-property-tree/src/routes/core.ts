import Router from '@koa/router'

const router = new Router({ prefix: '/core' })

router.get('/', async (ctx) => {
  ctx.body = 'Hello World'
})

export default router
