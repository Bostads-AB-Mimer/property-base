import { useQuery } from '@tanstack/react-query'
import { FilePlus } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Grid } from '@/components/ui/Grid'
import {
  workOrderService,
  WorkOrder,
} from '@/services/api/core/workOrderService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/v2/Tabs'
import { OrderCard } from '../work-orders/OrderCard'
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

  const statusA = statusOrder.indexOf(a.Status)
  const statusB = statusOrder.indexOf(b.Status)

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

  const workOrders = Array.from(workOrdersQuery.data)
    .sort(sortByStatus)
    .reduce<{ active: WorkOrder[]; historical: WorkOrder[] }>(
      (acc, curr) => {
        if (curr.Status === 'Avslutad') {
          acc.historical.push(curr)
          return acc
        } else {
          acc.historical.push(curr)
          return acc
        }
      },
      { active: [], historical: [] }
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <Button disabled size={'default'} variant={'default'}>
          <FilePlus className="mr-2 h-4 w-4" />
          Skapa ärende
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4 bg-slate-100/70 p-1 rounded-lg">
          <TabsTrigger value="active">Aktiva ärenden</TabsTrigger>
          <TabsTrigger value="history">Ärendehistorik</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {workOrders.active.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {workOrders.active.map((w) => (
                <OrderCard key={w.Id} workOrder={w} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 p-2">Inga aktiva ärenden.</p>
          )}
        </TabsContent>
        <TabsContent value="history">
          {workOrders.historical.length > 0 ? (
            <OrdersTable orders={workOrders.historical} />
          ) : (
            <p className="text-slate-500 p-2">Ingen ärendehistorik.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
