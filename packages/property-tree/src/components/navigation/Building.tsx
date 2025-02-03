import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, Property, Staircase } from '@/services/types'
import { Warehouse } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { ResidenceList } from './ResidenceList'

interface BuildingNavigationProps {
  building: Building
  staircase: Staircase
  property: Property
}

export function BuildingNavigation({
  building,
  staircase,
  property,
}: BuildingNavigationProps) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => {
          setIsExpanded(!isExpanded)
          navigate(`/buildings/${building.id}`, {
            state: { property, building, staircase },
          })
        }}
        tooltip={building.code}
      >
        <Warehouse />
        <span>{building.code}</span>
      </SidebarMenuButton>
      {isExpanded && (
        <div className="pl-4 mt-1">
          <ResidenceList staircase={staircase} building={building} />
        </div>
      )}
    </SidebarMenuItem>
  )
}
