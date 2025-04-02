import { ExtendableContext, Next } from 'koa'
import z, { ZodObject, ZodRawShape } from 'zod'

export function parseQueryParams<T extends ZodRawShape>(schema: ZodObject<T>) {
  return async (
    ctx: ExtendableContext & { parsed_query: z.infer<typeof schema> },
    next: Next,
  ) => {
    const result = schema.safeParse(ctx.request.query)

    if (result.success) {
      ctx.parsed_query = result.data
      return next()
    }

    ctx.status = 400
    ctx.body = {
      status: 'error',
      data: result.error.issues.map(({ message, path }) => ({
        message,
        path,
      })),
    }

    return
  }
}
