import Router from '@koa/router'
import { logger } from 'onecore-utilities'
import { z } from 'zod'

import { client } from '../../adapters/core'
import { parseQueryParams } from '../../middlewares/parse-query-params'
import { SearchResultSchema } from './schemas'

const router = new Router()

const SearchQueryParams = z.object({ q: z.string().min(3) })
type SearchResult = z.infer<typeof SearchResultSchema>

router.get('/search', parseQueryParams(SearchQueryParams), async (ctx) => {
  const { data, error } = await client.GET('/search', {
    params: { query: ctx.parsed_query },
  })

  if (error) {
    logger.error({ err: error }, 'core.search')
    ctx.status = 500
    return
  }

  if (!data.content) {
    logger.error({ err: error }, 'core.search - no content')
    ctx.status = 500
    return
  }

  ctx.status = 200
  ctx.body = data?.content satisfies Array<SearchResult>
})

export default router
