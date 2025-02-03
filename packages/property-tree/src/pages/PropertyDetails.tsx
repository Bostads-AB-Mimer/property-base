import React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { propertyService } from '@/services/api'
import { ViewHeader } from '@/components/shared/ViewHeader'
import { Building } from 'lucide-react'

export function PropertyDetails() {
  const location = useLocation()
  const propertyId = location.pathname.split('/').pop()

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getById(propertyId!),
    enabled: !!propertyId,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!property) {
    return <div>Property not found</div>
  }

  return (
    <div>
      <ViewHeader
        title={property.name}
        subtitle={property.code}
        type="Property"
        icon={Building}
      />
      {/* Add more property details here */}
    </div>
  )
}
