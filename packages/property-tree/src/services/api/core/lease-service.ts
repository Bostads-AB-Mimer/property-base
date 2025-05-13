import { GET } from './base-api'
import type { components } from './generated/api-types'
import { logger } from 'onecore-utilities'

type Lease = components['schemas']['Lease']
type GetLeasesByPropertyIdQueryParams =
  components['parameters']['GetLeasesByPropertyIdQueryParams']

async function getByPropertyId(
  propertyId: string,
  params: GetLeasesByPropertyIdQueryParams
): Promise<Array<Lease>> {
  try {
    const { data, error } = await GET('/leases/for/{propertyId}', {
      params: { path: { propertyId }, query: params },
    })

    if (error) throw error
    if (!data?.content) throw 'Response ok but missing content'

    return data?.content || []
  } catch (err) {
    logger.error({ err }, 'lease-service.getByPropertyId')
    throw err
  }
}

export const leaseService = { getByPropertyId }
