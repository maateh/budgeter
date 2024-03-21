import { ColumnDef } from "@tanstack/react-table"

// icons
import { PackageCheck, PackageOpen } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTable, DataTablePagination, getSelectionColumn } from "@/components/ui/data-table"

// hooks
import { useBudgets } from "@/lib/react-query/queries"
import { useCreateBackup } from "@/lib/react-query/mutations"

// types
import { Budget } from "@/services/api/types"

const columns: ColumnDef<Budget>[] = [
  getSelectionColumn(),
  {
    accessorKey: "name",
    header: "Budget Name"
  },
  {
    accessorKey: "balance.current",
    header: "Balance"
  },
  {
    accessorKey: "type",
    header: "Type"
  }
]

const BackupTable = () => {
  const { data: budgets, isLoading: isBudgetsLoading } = useBudgets()
  const { data: url, isPending: isBackupPending, mutateAsync: createBackup } = useCreateBackup()

  const handleCreate = async () => {
    try {
      await createBackup()
    } catch (err) {
      console.error(err)
    }
  }

  return !isBudgetsLoading && budgets && (
    <DataTable columns={columns} data={budgets}>
      {(table) => (
        <>
          <DataTablePagination table={table} showOnlyIfRequired />

          {/* TODO: implement footer with backup actions */}
          {/* <Button className="w-fit icon-wrapper"
            onClick={handleCreate}
          >
            <PackageOpen />
            Create a Backup
          </Button>

          {!isBackupPending ? url && (
            <a className="w-fit px-3.5 py-1.5 rounded-full border-2 icon-wrapper"
              href={url}
              download
            >
              <PackageCheck />
              Your Backup is ready to save
            </a>
          ) : (
            <>Loading...</> // TODO: skeleton
          )} */}
        </>
      )}
    </DataTable>
  )
}

export default BackupTable
