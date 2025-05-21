import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/v2/Table'
import { Badge } from '@/components/ui/v2/Badge'
import { WorkOrder } from '@/services/api/core/workOrderService'

interface OrdersTableProps {
  orders: WorkOrder[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const dateFormatter = new Intl.DateTimeFormat('sv-SE')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Ärende</TableHead>
          <TableHead>Skapat</TableHead>
          <TableHead>Förfaller</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.caption}</TableCell>
            <TableCell>
              {dateFormatter.format(new Date(order.registered))}
            </TableCell>
            <TableCell>
              {order.dueDate
                ? dateFormatter.format(new Date(order.dueDate))
                : null}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{order.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
