import KoaRouter from '@koa/router'
import { prisma } from '@src/adapters/db'
import {
  getLocationByRentalId,
  getLocationSizeByRentalId,
} from '@src/adapters/location-adapter'
import { getResidenceSizeByRentalId } from '@src/adapters/residence-adapter'
import { GetLocationByRentalIdResponse } from '@src/types/location'
import { logger, generateRouteMetadata } from 'onecore-utilities'
import { z } from 'zod'

/**
 * @swagger
 * openapi: 3.0.0
 * tags:
 *   - name: Residences
 *     description: Operations related to residences
 */
export const routes = (router: KoaRouter) => {
  /**
   * @swagger
   * /residences/rental-id/{rentalId}:
   *   get:
   *     summary: Get a residence by rental ID
   *     description: Returns a residence with the specified rental ID
   *     tags:
   *       - Residences
   *     parameters:
   *       - in: path
   *         name: rentalId
   *         required: true
   *         schema:
   *           type: string
   *         description: The rental ID of the residence
   *     responses:
   *       200:
   *         description: Successfully retrieved the residence
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetResidenceByRentalIdResponse'
   *       404:
   *         description: Residence not found
   *       500:
   *         description: Internal server error
   */
  router.get('(.*)/locations/rental-id/:rentalId', async (ctx) => {
    const metadata = generateRouteMetadata(ctx)
    logger.info(`GET /locations/rental-id/${ctx.params.rentalId}`, metadata)

    try {
      const location = await getLocationByRentalId(ctx.params.rentalId)
      const areaSize = await getLocationSizeByRentalId(ctx.params.rentalId)

      const payload: GetLocationByRentalIdResponse = {
        content: {
          id: location.propertyObject.location.id,
          code: location.propertyObject.location.code,
          name: location.propertyObject.location.name,
          entrance: location.propertyObject.location.entrance,
          deleted: Boolean(location.propertyObject.location.deleteMark),
          type: {
            code: location.propertyObject.location.propertyType.code,
            name: location.propertyObject.location.propertyType.name,
          },
          areaSize: areaSize?.value ?? null,
          building: {
            id: location.buildingId,
            code: location.buildingCode,
            name: location.buildingName,
          },
          property: {
            id: location.propertyId,
            code: location.propertyCode,
            name: location.propertyName,
          },
          rentalInformation: {
            rentalId: location.rentalId,
            apartmentNumber:
              location.propertyObject.rentalInformation.apartmentNumber,
            type: {
              code: location.propertyObject.rentalInformation
                .rentalInformationType.code,
              name: location.propertyObject.rentalInformation
                .rentalInformationType.name,
            },
          },
        },
        ...metadata,
      }

      ctx.status = 200
      ctx.body = payload
    } catch (err) {
      logger.error(err, 'Error fetching location rental property info')
      ctx.status = 500
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      ctx.body = { reason: errorMessage, ...metadata }
    }
  })
}
