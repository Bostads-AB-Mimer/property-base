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

  const { data: residences, isLoading: residencesLoading } = useQuery({
    queryKey: ['residences', buildingId],
    queryFn: () => residenceService.getByBuildingCode(buildingCode),
    enabled: !!buildingCode,
  })

  const residenceAddresses = residences?.map((r) => r.address).filter(Boolean) || []
  
  const { data: coordinates, isLoading: coordinatesLoading } = useQuery({
    queryKey: ['coordinates', residenceAddresses],
    queryFn: async () => {
      const coords = await Promise.all(
        residenceAddresses.map((address) => geocodingService.searchAddress(address))
      )
      return coords.filter((coord): coord is [number, number] => coord !== null)
    },
    enabled: residenceAddresses.length > 0,
  })

  const isLoading = buildingLoading || residencesLoading || coordinatesLoading

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!building || !residences || !coordinates?.length) {
    return <div>Building not found or no residences with coordinates</div>
  }

  const locations = residences
    .map((residence, index) => {
      if (!coordinates[index]) return null
      const floor = parseInt(residence.code.split('-')[0])
      return {
        name: `LGH ${residence.code}`,
        coordinates: coordinates[index],
        floor,
        color: `hsl(${(floor * 30) % 360}, 70%, 50%)`, // Different color for each floor
      }
    })
    .filter((loc): loc is NonNullable<typeof loc> => loc !== null)

  return (
    <div className="space-y-8">
      <ViewHeader
        title={building.name || buildingCode}
        subtitle={`Property ID: ${propertyId}`}
        type="Building"
        icon={Building2}
      />
      
      {locations.length > 0 && (
        <Map
          locations={locations}
          center={locations[0].coordinates}
        />
      )}
    </div>
  )
}
