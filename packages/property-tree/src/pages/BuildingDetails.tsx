import React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { buildingService } from '@/services/api'
import { ViewHeader } from '@/components/shared/ViewHeader'
import { Building2 } from 'lucide-react'

export function BuildingDetails() {
  const location = useLocation()
  const { buildingId, propertyId, buildingCode } = location.state || {}

  const { data: building, isLoading } = useQuery({
    queryKey: ['building', buildingId],
    queryFn: () => buildingService.getById(buildingId),
    enabled: !!buildingId,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!building) {
    return <div>Building not found</div>
  }

  return (
    <div>
      <ViewHeader
        title={building.name || buildingCode}
        subtitle={`Property ID: ${propertyId}`}
        type="Building"
        icon={Building2}
      />
      {/* Add more building details here */}
    </div>
  )
}
