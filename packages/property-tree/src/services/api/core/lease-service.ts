import { GET } from './base-api'
import type { components } from './generated/api-types'

type Lease = components['schemas']['Lease']

async function getByPropertyId(
  propertyId: string,
  params: { includeContacts?: boolean }
): Promise<Array<Lease>> {
  const { data, error } = await GET('/leases/for/propertyId/{propertyId}', {
    params: { path: { propertyId }, query: params },
  })

  if (error) throw error
  if (!data?.content) throw 'Response ok but missing content'

  return data?.content || []
}

export const leaseService = { getByPropertyId }
