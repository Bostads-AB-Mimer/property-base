import Router from '@koa/router'

import { client } from '../../adapters/core'

const router = new Router({ prefix: '/core' })

router.get('/test', async (ctx) => {
  const response = await client.GET('/offers/listing-id/{listingId}', {
    params: { path: { listingId: 1 } },
  })

  ctx.body = response.data
  ctx.status = 200
})

export default router
