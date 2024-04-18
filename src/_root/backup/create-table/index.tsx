import { useParams } from "react-router-dom"
import { Table as RTable } from "@tanstack/react-table"

// icons
import { PackageCheck, PackageOpen, X } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTable, DataTablePagination, DataTableSelectionInfo, getDefaultSelectedRows } from "@/components/ui/data-table"

// components
import BackupInfo from "@/components/shared/backup/BackupInfo"

// hooks
import { useBudgets } from "@/lib/react-query/queries"
import { useCreateBackup } from "@/lib/react-query/mutations"

// types
import { Budget } from "@/services/api/types"

// table columns
import { columns } from "./columns"

const BackupCreateTable = () => {
  const { budgetId } = useParams() as { budgetId?: string }

  const { data: budgets, isLoading: isBudgetsLoading } = useBudgets()
  const {
    data: backup, isPending: isBackupPending,
    mutateAsync: createBackup, reset: resetBackup
  } = useCreateBackup()

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
    <DataTable
      columns={columns}
      data={budgets}
      defaultSelectedRows={budgetId ? getDefaultSelectedRows(budgets, [budgetId]) : {}}
    >
      {(table) => (
        <div className="min-w-60 py-3 px-2 bg-primary rounded-3xl">
          <div className="flex flex-wrap justify-between px-2 gap-x-4 gap-y-3">
            <DataTableSelectionInfo className="w-fit mt-1.5"
              table={table}
            />
            <DataTablePagination className="w-fit ml-auto"
              table={table}
            />
          </div>

          <div className="mx-2 flex justify-between items-center">
            <Button className="icon-wrapper"
              onClick={() => handleCreate(table)}
              disabled={
                !!backup ||
                isBackupPending ||
                (!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected())
              }
            >
              <PackageOpen />
              Create a Backup
            </Button>

            <Button className={`cursor-pointer ${backup ? 'block' : 'hidden'}`}
              size="icon"
              variant="icon"
              onClick={resetBackup}
            >
              <X size={16} />
            </Button>
          </div>

          {!isBackupPending ? backup && (
            <>
              <BackupInfo {...backup.fileContent} />
              <a className="w-fit ml-auto px-3.5 py-1.5 font-medium font-heading bg-foreground text-background rounded-full icon-wrapper"
                href={backup.downloadUrl}
                download
              >
                <PackageCheck />
                Your backup is ready to save
              </a>
            </>
          ) : (
            <>Generating the backup...</> // TODO: skeleton
          )}
        </div>
      )}
    </DataTable>
  )
}

export default BackupCreateTable
