import React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { residenceService } from '@/services/api'
import { ViewHeader } from '@/components/shared/ViewHeader'
import { Home } from 'lucide-react'

export function ResidenceDetails() {
  const location = useLocation()
  const { buildingCode, floorCode } = location.state || {}
  const residenceId = location.pathname.split('/').pop()

  const { data: residence, isLoading } = useQuery({
    queryKey: ['residence', residenceId],
    queryFn: () => residenceService.getById(residenceId!),
    enabled: !!residenceId,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!residence) {
    return <div>Residence not found</div>
  }

  return (
    <div>
      <ViewHeader
        title={residence.name}
        subtitle={`Building: ${buildingCode}, Floor: ${floorCode}`}
        type="Residence"
        icon={Home}
      />
      {/* Add more residence details here */}
    </div>
  )
}
