import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Grid } from '@/components/ui/Grid'
import { workOrderService } from '@/services/api/core/workOrderService'

interface ResidenceWorkOrdersProps {
  rentalId: string
}

export function ResidenceWorkOrders({ rentalId }: ResidenceWorkOrdersProps) {
  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['workOrders', rentalId],
    queryFn: () => workOrderService.getWorkOrdersForResidence(rentalId),
  })

  if (isLoading) {
    return (
      <Card title="Rum">
        <Grid cols={2}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </Grid>
      </Card>
    )
  }

  return (
    <Card title="Ärenden">
      <Grid cols={2}>
        {workOrders?.map((workOrder) => (
          <a href={workOrder.Url} target="_blank">
            <Card key={workOrder.Id}>
              <p>{workOrder.Caption}</p>
            </Card>
          </a>
        ))}
      </Grid>
    </Card>
  )
}
