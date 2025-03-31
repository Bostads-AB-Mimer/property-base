import proxy from 'koa-proxies'
import { logger } from 'onecore-utilities'

import { config } from '../config'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5Z2NvcmUiLCJ1c2VybmFtZSI6InlnY29yZSIsImlhdCI6MTc0MzQzMjgwMCwiZXhwIjoxNzQzNDQzNjAwfQ.1RZVQTVIqAHvRqaGKF11GkW4T-1JUzLNrjrmtST5JW4'

export const coreProxy = proxy('/core', () => {
  return {
    target: config.CORE_API_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/core/, ''),
    logs: (ctx, target) =>
      logger.info(
        '[proxy] %s %s -> %s',
        ctx.req.method,
        //@ts-expect-error
        ctx.req.oldPath,
        new URL(ctx.request.url, target),
      ),
    headers: {
      authorization: `Bearer ${token}`,
    },
  }
})
