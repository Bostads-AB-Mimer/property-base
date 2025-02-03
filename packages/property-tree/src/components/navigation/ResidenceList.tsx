import React from 'react'
import { Building, Staircase } from '@/services/types'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarMenu } from '@/components/ui/sidebar'
import { ResidenceNavigation } from './Residence'
import { useQuery } from '@tanstack/react-query'
import { residenceService } from '@/services/api'

interface ResidenceListProps {
  building: Building
}

export function ResidenceList({ building }: ResidenceListProps) {
  const {
    data: residences,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['residences', building.id],
    queryFn: () => residenceService.getByBuildingCode(building.code),
  })

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-8 mx-2 mb-2" />
        <Skeleton className="h-8 mx-2" />
      </>
    )
  }

  if (error) {
    console.error(
      `Failed to load residences for building ${building.id}:`,
      error
    )
    return (
      <div className="text-sm text-destructive px-2">
        Failed to load residences
      </div>
    )
  }

  return (
    <SidebarMenu>
      {residences?.map((residence) => (
        <ResidenceNavigation 
          key={residence.id} 
          residence={residence}
          buildingCode={building.code}
          floorCode={residence.code.split('-')[0]} // Assuming floor code is first part of residence code
        />
      ))}
    </SidebarMenu>
  )
}
