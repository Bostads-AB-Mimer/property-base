import proxy from 'koa-proxies'
import { logger } from 'onecore-utilities'
import { Context, Next } from 'koa'

import { config } from '../config'
import { getCoreBearerToken } from '../adapters/core'

function makeProxyRequest(
  ctx: Context,
  next: Next,
  token: string,
): Promise<number | undefined> {
  return new Promise((resolve) =>
    proxy('/core', () => ({
      headers: {
        authorization: `Bearer ${token}`,
      },
      target: config.CORE__API_URL,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/core/, ''),
      logs: (ctx: Context, target) =>
        logger.info(
          '[proxy] %s %s -> %s',
          ctx.req.method,
          //@ts-expect-error
          ctx.req.oldPath,
          new URL(ctx.request.url, target),
        ),
      events: {
        proxyRes: (res) => resolve(res.statusCode),
      },
    }))(ctx, next),
  )
}

export async function coreProxy(ctx: Context, next: Next, attempts = 0) {
  try {
    const token = await getCoreBearerToken({ refresh: attempts > 0 })
    const status = await makeProxyRequest(ctx, next, token)

    if (status === 401) {
      if (attempts > 0) {
        logger.error('Core authentication failed even after token refresh')
        ctx.status = 500
        ctx.body = { error: 'Failed to authenticate with core service' }
        return
      } else {
        logger.info(
          'Core authentication received 401, retrying with fresh token',
        )
        await coreProxy(ctx, next, attempts + 1)
      }
    }
  } catch (error) {
    logger.error('Proxy request failed:', error)
    ctx.status = 500
    ctx.body = { error: 'Internal server error' }
  }
}
