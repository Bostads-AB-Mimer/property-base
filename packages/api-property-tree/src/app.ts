import Koa from 'koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import session from 'koa-session'
import bodyParser from 'koa-body'
import { logger, loggerMiddlewares } from 'onecore-utilities'

import authRouter from './routes/auth'
import { coreProxy } from './routes/core'

const CONFIG = {
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  /** (number || 'session') maxAge in ms (default is 1 day) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: false /** (boolean) signed or not (default true) */,
  rolling:
    true /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew:
    false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  secure: false /** (boolean) secure cookie*/,
  sameSite: undefined,
}

const app = new Koa()
const router = new Router()

app.use(session(CONFIG, app))
app.use(async (ctx, next) => {
  if (process.env.DISABLE_AUTHENTICATION) {
    return next()
  }

  if (ctx.request.path.match('(.*)/auth/')) {
    return next()
  } else {
    if (!ctx.session?.isAuthenticated) {
      ctx.status = 401
    } else {
      return next()
    }
  }
})

app.use(cors({ credentials: true }))
app.use(bodyParser())

app.on('error', (err) => {
  logger.error(err)
})

app.use(loggerMiddlewares.pre)
app.use(loggerMiddlewares.post)

router.use(authRouter.routes())
app.use(router.routes())
app.use(coreProxy)

export default app
