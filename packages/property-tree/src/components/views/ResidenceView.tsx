import { useParams, useLocation } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { Grid } from '@/components/ui/Grid'
import { residenceService } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { ResidenceWorkOrders } from '../shared/ResidenceWorkOrders'
import { ResidenceBasicInfo } from '../residence/ResidenceBasicInfo'

function LoadingSkeleton() {
  return (
    <div className="p-8 animate-in">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>

      <Grid cols={4} className="mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
          />
        ))}
      </Grid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

export function ResidenceView() {
  const { residenceId } = useParams()
  const { state } = useLocation()

  const residenceQuery = useQuery({
    queryKey: ['residence', residenceId],
    queryFn: () => residenceService.getById(residenceId!),
    enabled: !!residenceId,
  })

  const buildingCode = state?.buildingCode
  const staircaseCode = state?.staircaseCode

  const isLoading = residenceQuery.isLoading
  const error = residenceQuery.error
  const residence = residenceQuery.data

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error || !residence) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Bostad hittades inte
        </h2>
      </div>
    )
  }

  return (
    <div className="p-8 animate-in grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <ResidenceBasicInfo residence={residence} />
      </div>
      <div className="lg:col-span-2 space-y-6">
        {residence.propertyObject.rentalId && (
          <ResidenceWorkOrders rentalId={residence.propertyObject.rentalId} />
        )}
      </div>
    </div>
  )
}
