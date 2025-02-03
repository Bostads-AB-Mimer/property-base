import { Building, Residence, Staircase } from '@/services/types'
import { Hotel } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { useNavigate } from 'react-router-dom'

interface ResidenceNavigationProps {
  residence: Residence
  building: Building
  staircase: Staircase
}

export function ResidenceNavigation({
  residence,
  building,
  staircase,
}: ResidenceNavigationProps) {
  const navigate = useNavigate()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => {
          navigate(`/residences/${residence.id}`, {
            state: {
              buildingCode: building.code,
              floorCode: staircase.code,
            },
          })
        }}
        tooltip={residence.name}
      >
        <Hotel />
        <span>LGH-{residence.code}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
