import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Map } from '@/components/shared/Map'
import { Button } from '@/components/ui/button'
import { MapIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { geocodingService } from '@/services/api/geocodingService'

interface MapDialogProps {
  residences: Array<{
    code: string
    name: string
    address: string
  }>
}

export function MapDialog({ residences }: MapDialogProps) {
  const residenceAddresses = residences.map((r) => r.address).filter(Boolean)

  const { data: coordinates, isLoading } = useQuery({
    queryKey: ['coordinates', residenceAddresses],
    queryFn: async () => {
      const coords = await Promise.all(
        residenceAddresses.map((address) => geocodingService.searchAddress(address))
      )
      return coords.filter((coord): coord is [number, number] => coord !== null)
    },
    enabled: residenceAddresses.length > 0,
  })

  const locations = residences
    .map((residence, index) => {
      if (!coordinates?.[index]) return null
      const floor = parseInt(residence.code.split('-')[0])
      return {
        name: `LGH ${residence.code}`,
        coordinates: coordinates[index],
        floor,
        color: `hsl(${(floor * 30) % 360}, 70%, 50%)`,
      }
    })
    .filter((loc): loc is NonNullable<typeof loc> => loc !== null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MapIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        {locations.length > 0 ? (
          <Map locations={locations} center={locations[0].coordinates} />
        ) : (
          <div className="text-center py-4">
            {isLoading ? 'Loading...' : 'No locations available'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
