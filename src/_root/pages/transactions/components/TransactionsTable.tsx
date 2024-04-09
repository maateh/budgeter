// shadcn
import { DataTable, DataTablePagination, getSelectionColumn } from "@/components/ui/data-table"

// components
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/payment/custom/PaymentBadge"

// hooks
import { useTransactionsPagination } from "@/lib/react-query/queries"

// types
import { ColumnDef } from "@tanstack/react-table"
import { Budget, Transaction } from "@/services/api/types"

// utils
import { format } from "date-fns"

// TODO: design cells
const columns: ColumnDef<(Transaction & { budget: Budget })>[] = [
  // TODO: selection is required to bulk delete selected transactions
  getSelectionColumn(),
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "paymentId",
    header: "Payment",
    cell: ({ row }) => (
      <PaymentBadge
        size="sm"
        payment={row.original.payment}
        currency={row.original.budget.balance.currency}
        processed={row.original.processed}
      />
    )
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    accessorKey: "budgetId",
    header: "Budget",
    cell: ({ row }) => (
      <BudgetNameBadge
        size="sm"
        budget={row.original.budget}
      />
    )
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(row.original.createdAt, 'yyyy. MM. dd.')
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => format(row.original.updatedAt, 'yyyy. MM. dd.')
  },
  {
    accessorKey: "processed",
    header: "Processed"
  }
]

const TransactionsTable = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useTransactionsPagination({
    params: { limit: 10, offset: 0 }
  })

  return !isLoading && data && (
    <>
      <DataTable
        columns={columns}
        data={data.pages.flatMap((page) => page.data)}
      >
        {(table) => <DataTablePagination table={table} showOnlyIfRequired />}
      </DataTable>
    </>
  )
}

export default TransactionsTable
