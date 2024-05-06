// components
import BudgetNameBadge from "@/components/shared/budget/ui/BudgetNameBadge"
import PaymentBadge from "@/components/shared/payment/ui/PaymentBadge"
import TransactionStatusToggle from "@/components/shared/transaction/ui/TransactionStatusToggle"
import SortingButton from "@/components/ui/custom/SortingButton"

// custom cells
import Actions from "./Actions"

// types
import { ColumnDef } from "@tanstack/react-table"
import { Budget, Transaction } from "@/services/api/types"

// utils
import { format } from "date-fns"
import { isNeutral } from "@/components/shared/payment/utils"

export const columns: ColumnDef<Transaction & { budget: Budget }>[] = [
  {
    id: "Status",
    accessorKey: "processed",
    enableHiding: false,
    header: "Status",
    cell: ({ row }) => (
      <TransactionStatusToggle
        iconProps={{ size: 20 }}
        transaction={row.original}
      />
    )
  },
  {
    id: "Name",
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <SortingButton sortingKey="name">{column.id}</SortingButton>
    ),
    cell: ({ row }) => (
      <span className="capitalize font-semibold small-caps">
        {row.original.name}
      </span>
    )
  },
  {
    id: "Payment",
    accessorKey: "paymentId",
    header: ({ column }) => (
      <SortingButton sortingKey="payment.amount">{column.id}</SortingButton>
    ),
    cell: ({ row }) => (
      <PaymentBadge className="border-2"
        size="sm"
        payment={row.original.payment}
        currency={row.original.budget.balance.currency}
        processed={row.original.payment.processed}
        isNeutral={isNeutral(row.original.type, row.original.payment.processed)}
        showProgress
        transaction={row.original}
        budgetName={row.original.budget.name}
      />
    )
  },
  {
    id: "Type",
    accessorKey: "type",
    header: () => <SortingButton sortingKey="type">Type</SortingButton>,
    cell: ({ row }) => (
      <span className="capitalize text-base font-normal all-small-caps">
        {row.original.type}
      </span>
    )
  },
  {
    id: "Budget",
    accessorKey: "budgetId",
    header: ({ column }) => (
      <SortingButton sortingKey="budgetId">{column.id}</SortingButton>
    ),
    cell: ({ row }) => (
      <BudgetNameBadge
        size="sm"
        budget={row.original.budget}
      />
    )
  },
  {
    id: "Created",
    accessorKey: "createdAt",
    header: ({ column }) => <SortingButton sortingKey="createdAt">{column.id}</SortingButton>,
    cell: ({ row }) => (
      <span className="text-xs font-normal">
        {format(row.original.createdAt, 'yyyy. MM. dd.')}
      </span>
    )
  },
  {
    id: "Last Updated",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortingButton sortingKey="updatedAt">{column.id}</SortingButton>
    ),
    cell: ({ row }) => (
      <span className="text-xs font-normal">
        {format(row.original.updatedAt, 'yyyy. MM. dd.')}
      </span>
    )
  },
  {
    id: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <Actions transaction={row.original} />
  }
]
