import React from 'react'
import { Building } from '@/services/types'
import { Warehouse } from 'lucide-react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar'
import { StaircaseNavigation } from './StaircaseNavigation'
import { useQuery } from '@tanstack/react-query'
import { GET } from '@/services/api/baseApi'

interface BuildingNavigationProps {
  building: Building
}

export function BuildingNavigation({ building }: BuildingNavigationProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const {
    data: staircases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['staircases', building.id],
    queryFn: () =>
      GET('/staircases', {
        params: { query: { buildingCode: building.code } },
      }),
    enabled: isExpanded,
    select: (response) => response.data?.content,
  })

  if ((isLoading && isExpanded) || !staircases) {
    return (
      <SidebarMenuItem>
        <div className="animate-pulse h-8 bg-sidebar-accent/10 rounded-md" />
      </SidebarMenuItem>
    )
  }

  if (error) {
    console.error(
      `Failed to load staircases for building ${building.id}:`,
      error
    )
    return (
      <SidebarMenuItem>
        <div className="text-sm text-destructive px-2">
          Failed to load staircases
        </div>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
        tooltip={building.name}
      >
        <Warehouse />
        <span>{building.name}</span>
      </SidebarMenuButton>
      {isExpanded && (
        <SidebarMenu>
          {staircases.map((staircase) => (
            <StaircaseNavigation key={staircase.id} staircase={staircase} />
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  )
}
