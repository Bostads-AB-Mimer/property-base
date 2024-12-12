import Koa from 'koa'
import KoaRouter from '@koa/router'
import bodyParser from 'koa-body'
import cors from '@koa/cors'

import api from './api'

import { logger, loggerMiddlewares } from 'onecore-utilities'
import { koaApiReference } from '@scalar/koa-api-reference'

const app = new Koa()

// Configure CORS with specific options
app.use(
  cors({
    origin: '*', // Allow all origins
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
    maxAge: 5, // Preflight requests are cached for 5 seconds
    credentials: true, // Allow credentials (cookies, authorization headers, etc)
  })
)

app.use(
  koaApiReference({
    spec: {
      url: '/openapi.json'
    },
    page: {
      title: 'Property Base API Reference',
      description: 'API documentation for the Property Base system'
    }
  })
)

app.on('error', (err) => {
  logger.error(err)
})

app.use(bodyParser())

// Log the start and completion of all incoming requests
//app.use(loggerMiddlewares.pre)
//app.use(loggerMiddlewares.post)

const publicRouter = new KoaRouter()

app.use(publicRouter.routes())

app.use(api.routes())

export default app
