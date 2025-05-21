import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/v2/Card'
import { Badge } from '@/components/ui/v2/Badge'
import { WorkOrder } from '@/services/api/core/workOrderService'

type OrderCardProps = {
  workOrder: WorkOrder
}

export function OrderCard({ workOrder }: OrderCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  const getPriorityColor = (priority: string) => {
    return (
      priorityColors[priority as keyof typeof priorityColors] ||
      'bg-gray-100 text-gray-800'
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <CardTitle className="text-base font-medium">
              {workOrder.title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              ID: {workOrder.id}
            </span>
          </div>
          <Badge className={getPriorityColor(workOrder.priority)}>
            {workOrder.priority === 'low'
              ? 'Låg'
              : workOrder.priority === 'medium'
                ? 'Medium'
                : 'Hög'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-2">{workOrder.description}</div>
        <div className="text-xs text-muted-foreground">
          <div>Rapporterad: {workOrder.reportedDate}</div>
          <div>Tilldelad: {workOrder.assignedTo}</div>
        </div>
      </CardContent>
    </Card>
  )
}
