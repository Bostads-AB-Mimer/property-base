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
            <TableCell>{order.registered}</TableCell>
            <TableCell>{'N/A'}</TableCell>
            <TableCell>
              <Badge variant="outline">{order.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
