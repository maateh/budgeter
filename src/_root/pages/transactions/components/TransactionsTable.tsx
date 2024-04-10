import { useState } from "react"

// icons
import { MoreHorizontal, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable, DataTableColumnToggle, DataTablePagination } from "@/components/ui/data-table"

// components
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/payment/custom/PaymentBadge"
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"

// hooks
import { useTransactionsControlledPagination } from "@/lib/react-query/queries"

// types
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { Budget, Transaction } from "@/services/api/types"

// utils
import { format } from "date-fns"

// TODO: design cells: name, type, createdAt, updatedAt
const columns: ColumnDef<(Transaction & { budget: Budget })>[] = [
  {
    accessorKey: "processed",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <TransactionStatusToggle
        iconProps={{ size: 20 }}
        transaction={row.original}
        budget={row.original.budget}
      />
    )
  },
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <div onClick={() => column.toggleSorting()}>Name</div>
    )
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
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0"
            variant="ghost"
            size="sm"
          >
            <span className="sr-only">Open actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-0.5" align="end">
          <DropdownMenuLabel className="text-base font-heading small-caps">
          Actions
          </DropdownMenuLabel>
          <DropdownMenuItem className="text-destructive font-bold icon-wrapper hover:cursor-pointer focus:bg-destructive"
            onClick={() => {}}
          >
            <Trash2 size={14} strokeWidth={3} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]

const TransactionsTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const { data: currentPage, isLoading } = useTransactionsControlledPagination({
    params: {
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize
    }
  })

  return !isLoading && currentPage && (
    <>
      <DataTable
        columns={columns}
        data={currentPage.data}
        pagination={{
          manualPagination: true,
          rowCount: currentPage.total,
          onPaginationChange: setPagination
        }}
        state={{ pagination }}
      >
        {(table) => (
          <div className="min-w-60 py-3.5 px-2.5 flex flex-wrap justify-between gap-x-4 gap-y-3 bg-primary rounded-3xl">
            <DataTableColumnToggle className="w-fit"
              table={table}
            />

            <DataTablePagination className="w-fit ml-auto"
              table={table}
            />
          </div>
        )}
      </DataTable>
    </>
  )
}

export default TransactionsTable
