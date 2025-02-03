import React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { buildingService } from '@/services/api'
import { ViewHeader } from '@/components/shared/ViewHeader'
import { Building2 } from 'lucide-react'
import { Map } from '@/components/shared/Map'
import { geocodingService } from '@/services/api/geocodingService'

export function BuildingDetails() {
  const location = useLocation()
  const { buildingId, propertyId, buildingCode } = location.state || {}

  const { data: building, isLoading: buildingLoading } = useQuery({
    queryKey: ['building', buildingId],
    queryFn: () => buildingService.getById(buildingId),
    enabled: !!buildingId,
  })

  const { data: coordinates, isLoading: coordinatesLoading } = useQuery({
    queryKey: ['coordinates', building?.address],
    queryFn: () => geocodingService.searchAddress(building?.address || ''),
    enabled: !!building?.address,
  })

  const isLoading = buildingLoading || coordinatesLoading

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!building) {
    return <div>Building not found</div>
  }

  return (
    <div className="space-y-8">
      <ViewHeader
        title={building.name || buildingCode}
        subtitle={`Property ID: ${propertyId}`}
        type="Building"
        icon={Building2}
      />
      
      {coordinates && (
        <Map
          location={{
            name: building.name || buildingCode,
            coordinates: coordinates,
          }}
        />
      )}
    </div>
  )
}
