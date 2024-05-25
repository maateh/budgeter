// shadcn
import { getSelectionColumn } from "@/components/ui/data-table"

// components
import BalanceBadge from "@/components/shared/budget/ui/BalanceBadge"
import BudgetNameBadge from "@/components/shared/budget/ui/BudgetNameBadge"

// types
import { ColumnDef } from "@tanstack/react-table"
import { Budget } from "@/services/api/types"

export const columns: ColumnDef<Budget>[] = [
  getSelectionColumn(),
  {
    accessorKey: "name",
    header: "Budget Name",
    cell: ({ row }) => <BudgetNameBadge budget={row.original} />
  },
  {
    accessorKey: "balance.current",
    header: "Balance",
    cell: ({ row }) => (
      <BalanceBadge className="px-3 py-1 min-w-28"
        separatorProps={{ className: "h-4" }}
        orientation="vertical"
        size="xs"
        customLabel=""
        iconProps={{ size: 18 }}
        balance={row.original.balance}
      />
    )
  }
]
