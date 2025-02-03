import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, Property, Staircase } from '@/services/types'
import { Warehouse } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { ResidenceList } from './ResidenceList'

interface BuildingNavigationProps {
  building: Building
  property: Property
}

export function BuildingNavigation({
  building,
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
            state: {
              propertyId: property.id,
              buildingId: building.id,
              buildingCode: building.code,
            },
          })
        }}
        tooltip={building.code}
      >
        <Warehouse />
        <span>{building.code}</span>
      </SidebarMenuButton>
      {isExpanded && (
        <div className="pl-4 mt-1">
          <ResidenceList building={building} />
        </div>
      )}
    </SidebarMenuItem>
  )
}
