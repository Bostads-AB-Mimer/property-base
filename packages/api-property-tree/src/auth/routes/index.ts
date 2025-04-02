import Router from '@koa/router'
import { generateRouteMetadata } from 'onecore-utilities'

import { login, handleRedirect, logout } from '../../adapters/auth'

const router = new Router({ prefix: '/auth' })

router.get('/login', async (ctx) => {
  await login()(ctx)
})

router.get('/logout', async (ctx) => {
  await logout()(ctx)
})

router.post('/redirect', async (ctx) => {
  await handleRedirect()(ctx)
})

router.get('/profile', async (ctx) => {
  const metadata = generateRouteMetadata(ctx)
  if (ctx.session?.isAuthenticated && ctx.session?.account) {
    const account = {
      name: ctx.session.account.name,
      username: ctx.session.account.username,
    }

    ctx.body = {
      content: {
        account,
        ...metadata,
      },
    }
  } else {
    ctx.status = 401
    ctx.body = { error: 'Unauthorized', ...metadata }
  }
})

export default router
