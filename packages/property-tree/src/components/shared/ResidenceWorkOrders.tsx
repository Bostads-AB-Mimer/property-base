import { useQuery } from '@tanstack/react-query'
import { FilePlus } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Grid } from '@/components/ui/Grid'
import {
  workOrderService,
  WorkOrder,
} from '@/services/api/core/workOrderService'
import { OrdersTable } from '../work-orders/OrderTable'
import { Button } from '../ui/v2/Button'

interface ResidenceWorkOrdersProps {
  rentalId: string
}

const sortByStatus = (a: WorkOrder, b: WorkOrder) => {
  // TODO we should include the maintenance stage sequence in WorkOrder and sort by that
  const statusOrder = [
    'Väntar på handläggning',
    'Resurs tilldelad',
    'Påbörjad',
    'Väntar på beställda varor',
    'Utförd',
    'Avslutad',
  ]

  const statusA = statusOrder.indexOf(a.status)
  const statusB = statusOrder.indexOf(b.status)

  if (statusA < statusB) {
    return -1
  }
  if (statusA > statusB) {
    return 1
  }
  return 0
}

export function ResidenceWorkOrders({ rentalId }: ResidenceWorkOrdersProps) {
  const workOrdersQuery = useQuery({
    queryKey: ['workOrders', rentalId],
    queryFn: () => workOrderService.getWorkOrdersForResidence(rentalId),
  })

  if (workOrdersQuery.isLoading) {
    return (
      <Card title="Ärenden">
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

  if (workOrdersQuery.error || !workOrdersQuery.data) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Kontrakt hittades inte
        </h2>
      </div>
    )
  }

  const workOrders = workOrdersQuery.data.sort(sortByStatus)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <Button disabled size={'default'} variant={'default'}>
          <FilePlus className="mr-2 h-4 w-4" />
          Skapa ärende
        </Button>
      </div>

      {workOrders.length > 0 ? (
        <OrdersTable orders={workOrdersQuery.data} />
      ) : (
        <p className="text-slate-500 p-2">Ingen ärendehistorik.</p>
      )}
    </div>
  )
}
