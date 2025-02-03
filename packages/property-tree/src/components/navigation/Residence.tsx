import { Residence } from '@/services/types'
import { Hotel } from 'lucide-react'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { useNavigate } from 'react-router-dom'

interface ResidenceNavigationProps {
  residence: Residence
}

export function ResidenceNavigation({ residence }: ResidenceNavigationProps) {
  const navigate = useNavigate()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => {
          navigate(`/residences/${residence.id}`, {
            state: { 
              buildingCode: residence.buildingCode,
              floorCode: residence.floorCode
            }
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
