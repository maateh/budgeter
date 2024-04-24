// components
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import PaymentBadge from "@/components/shared/payment/custom/PaymentBadge"
import TransactionStatusToggle from "@/components/shared/transaction/custom/TransactionStatusToggle"
import SortingButton from "@/components/ui/custom/SortingButton"

// custom cells
import Actions from "./Actions"

// types
import { ColumnDef } from "@tanstack/react-table"
import { Budget, Transaction } from "@/services/api/types"

// utils
import { format } from "date-fns"

export const columns: ColumnDef<Transaction & { budget: Budget }>[] = [
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
    header: () => <SortingButton sortingKey="name">Name</SortingButton>,
    cell: ({ row }) => (
      <span className="capitalize font-semibold small-caps">
        {row.original.name}
      </span>
    )
  },
  {
    accessorKey: "paymentId",
    header: () => <SortingButton sortingKey="payment.amount">Payment</SortingButton>,
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
    header: () => <SortingButton sortingKey="type">Type</SortingButton>,
    cell: ({ row }) => (
      <span className="capitalize text-base font-normal all-small-caps">
        {row.original.type}
      </span>
    )
  },
  {
    accessorKey: "budgetId",
    header: () => <SortingButton sortingKey="budgetId">Budget</SortingButton>,
    cell: ({ row }) => (
      <BudgetNameBadge
        size="sm"
        budget={row.original.budget}
      />
    )
  },
  {
    accessorKey: "createdAt",
    header: () => <SortingButton sortingKey="createdAt">Created</SortingButton>,
    cell: ({ row }) => (
      <span className="text-xs font-normal">
        {format(row.original.createdAt, 'yyyy. MM. dd.')}
      </span>
    )
  },
  {
    accessorKey: "updatedAt",
    header: () => <SortingButton sortingKey="updatedAt">Last Updated</SortingButton>,
    cell: ({ row }) => (
      <span className="text-xs font-normal">
        {format(row.original.updatedAt, 'yyyy. MM. dd.')}
      </span>
    )
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <Actions transaction={row.original} />
  }
]
