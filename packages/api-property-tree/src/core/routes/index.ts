import Router from '@koa/router'

import searchRouter from './search'

const router = new Router({ prefix: '/core' })
router.use(searchRouter.routes())

export default router
