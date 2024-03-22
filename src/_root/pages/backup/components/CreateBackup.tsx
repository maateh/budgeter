import { ColumnDef, Table as RTable } from "@tanstack/react-table"

// icons
import { PackageCheck, PackageOpen } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTable, DataTablePagination, getSelectionColumn } from "@/components/ui/data-table"

// components
import BackupInfo from "@/components/shared/backup/BackupInfo"
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import BalanceBadge from "@/components/shared/budget/custom/BalanceBadge"

// hooks
import { useBudgets } from "@/lib/react-query/queries"
import { useCreateBackup } from "@/lib/react-query/mutations"

// types
import { Budget } from "@/services/api/types"

const columns: ColumnDef<Budget>[] = [
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
        iconSize={18}
        balance={row.original.balance}
      />
    )
  },
  // TODO: it might not be necessary
  // {
  //   accessorKey: "type",
  //   header: "Type"
  // }
]

const CreateBackup = () => {
  const { data: budgets, isLoading: isBudgetsLoading } = useBudgets()
  const { data: backup, isPending: isBackupPending, mutateAsync: createBackup } = useCreateBackup()

  const handleCreate = async (table: RTable<Budget>) => {
    const complete = table.getIsAllRowsSelected()
    const budgetIds = table.getSelectedRowModel()
      .rows.map(({ original }) => original.id)

    try {
      await createBackup({ complete, budgetIds })
    } catch (err) {
      console.error(err)
    }
  }

  return !isBudgetsLoading && budgets && (
    <DataTable columns={columns} data={budgets}>
      {(table) => (
        <div className="my-2 py-3 px-2 sticky bottom-1.5 space-y-2.5 bg-primary rounded-3xl">
          <DataTablePagination table={table} />

          <Button className="w-fit mx-auto icon-wrapper md:ml-2"
            onClick={() => handleCreate(table)}
            disabled={
              isBackupPending ||
              !!backup ||
              (!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected())
            }
          >
            <PackageOpen />
            Create a Backup
          </Button>

          {!isBackupPending ? backup && (
            <div className="mx-2">
              <BackupInfo {...backup.fileContent} />
              <a className="w-fit ml-auto px-3.5 py-1.5 font-medium font-heading bg-foreground text-background rounded-full icon-wrapper"
                href={backup.downloadUrl}
                download
              >
                <PackageCheck />
                Your backup is ready to save
              </a>
            </div>
          ) : (
            <>Generating the backup...</> // TODO: skeleton
          )}
        </div>
      )}
    </DataTable>
  )
}

export default CreateBackup
