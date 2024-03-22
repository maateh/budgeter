import { useState } from "react"
import { ColumnDef, Table as RTable, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

// shadcn
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableProps<D, V> {
  columns: ColumnDef<D, V>[]
  data: D[]
  children?: (table: RTable<D>) => React.ReactNode
}

function getSelectionColumn<D, V>(): ColumnDef<D, V> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        aria-label="Select row"
      />
    )
  }
}

function DataTable<D, V>({ data, columns, children }: DataTableProps<D, V>) {
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection }
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {!header.isPlaceholder && flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell className="h-24 text-center"
                colSpan={columns.length}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {children && children(table)}
    </>
  )
}

interface DataTablePaginationProps<D>
  extends React.HTMLAttributes<HTMLDivElement> {
    table: RTable<D>
    showOnlyIfRequired?: boolean
}
 
function DataTablePagination<D>({
  table, showOnlyIfRequired, className, ...props
}: DataTablePaginationProps<D>) {
  return (!showOnlyIfRequired || (table.getCanPreviousPage() || table.getCanNextPage())) && (
    <div className={cn("flex items-center justify-between px-2", className)} {...props}>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button className="hidden h-8 w-8 p-0 lg:flex"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button className="h-8 w-8 p-0"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button className="h-8 w-8 p-0"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button className="hidden h-8 w-8 p-0 lg:flex"
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export {
  DataTable,
  DataTablePagination,
  getSelectionColumn
}
