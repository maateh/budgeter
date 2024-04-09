/* eslint-disable react-refresh/only-export-components */
import { useState } from "react"
import { ColumnDef, Table as RTable, RowSelectionState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

// shadcn
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination, PaginationContent, PaginationFirst, PaginationInfo, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// utils
import { cn } from "@/lib/utils"

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

function getDefaultSelectedRows<D extends { id: string }>(data: D[], customIds: string[]): RowSelectionState {
  return data.reduce((selectedRows, { id }, index) => {
    if (!customIds.includes(id)) return selectedRows
    return {
      ...selectedRows,
      [index]: true
    }
  }, {} as RowSelectionState)
}

interface DataTableProps<D, V> {
  columns: ColumnDef<D, V>[]
  data: D[]
  defaultSelectedRows?: RowSelectionState
  children?: (table: RTable<D>) => React.ReactNode
}

function DataTable<D, V>({ data, columns, defaultSelectedRows = {}, children }: DataTableProps<D, V>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(defaultSelectedRows)

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
 
function DataTablePagination<D>({ table, showOnlyIfRequired, className, ...props }: DataTablePaginationProps<D>) {
  const {
    getFilteredSelectedRowModel,
    getFilteredRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getState,
    getPageCount,
    setPageIndex,
    previousPage,
    nextPage
  } = table

  /**
   * Even if pagination is added to data-table, the 'showOnlyIfRequired' prop
   * makes it possible to show the pagination footer only if the amount
   * of table data can't fit into a single table.
   */
  if (showOnlyIfRequired && !(getCanPreviousPage() || getCanNextPage())) return

  return (
    <div className={cn("flex flex-wrap items-center justify-between px-2 gap-2.5", className)} {...props}>
      <div className="flex-1 text-sm text-muted-foreground">
        {getFilteredSelectedRowModel().rows.length} of{" "}
        {getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <Pagination className="flex-1 flex flex-col items-end gap-y-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst onClick={() => setPageIndex(0)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious onClick={previousPage} />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={nextPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast onClick={() => setPageIndex(getPageCount() - 1)} />
          </PaginationItem>
        </PaginationContent>

        <PaginationInfo className="mr-1.5"
          currentPage={getState().pagination.pageIndex + 1}
          totalPage={getPageCount()}
        />
      </Pagination>
    </div>
  )
}

export {
  DataTable,
  DataTablePagination,
  getSelectionColumn,
  getDefaultSelectedRows
}
