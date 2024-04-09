/* eslint-disable react-refresh/only-export-components */
import { useState } from "react"
import { ColumnDef, Table as RTable, RowSelectionState, SortingState, VisibilityState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// icons
import { ChevronDown } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationFirst, PaginationInfo, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious, PaginationProps } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// utils
import { cn } from "@/lib/utils"

function getSelectionColumn<D, V>(): ColumnDef<D, V> {
  return {
    id: "select",
    enableHiding: false,
    enableSorting: false,
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
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    /** Defaults */
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    /** Pagination */
    getPaginationRowModel: getPaginationRowModel(),
    /** Row selection */
    onRowSelectionChange: setRowSelection,
    /** Sorting */
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    /** Visibility */
    onColumnVisibilityChange: setColumnVisibility,
    /** State for different functionalities */
    state: { rowSelection, sorting, columnVisibility }
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

      {children && (
        <div className="sticky bottom-1.5 my-2">
          {children(table)}
        </div>
      )}
    </>
  )
}

interface DataTableSelectionInfoProps<D>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: RTable<D>
}

function DataTableSelectionInfo<D>({ table, className, ...props }: DataTableSelectionInfoProps<D>) {
  const {
    getFilteredSelectedRowModel,
    getFilteredRowModel
  } = table

  return (
    <div className={cn("flex-1 text-sm text-muted-foreground", className)} {...props}>
      {getFilteredSelectedRowModel().rows.length} of{" "}
      {getFilteredRowModel().rows.length} row(s) selected.
    </div>
  )
}

interface DataTablePaginationProps<D> extends PaginationProps {
  table: RTable<D>
}
 
function DataTablePagination<D>({ table, className, ...props }: DataTablePaginationProps<D>) {
  const {
    getState,
    getPageCount,
    setPageIndex,
    previousPage,
    nextPage
  } = table

  return (
    <Pagination className={cn("flex-1 flex flex-col items-end gap-y-2", className)} {...props}>
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

      <PaginationInfo className="mr-1.5 text-muted-foreground"
        currentPage={getState().pagination.pageIndex + 1}
        totalPage={getPageCount()}
      />
    </Pagination>
  )
}

interface DataTableColumnToggleProps<D> extends ButtonProps {
  table: RTable<D>
}

function DataTableColumnToggle<D>({
  table, className, variant = "outline", size = "sm", ...props
}: DataTableColumnToggleProps<D>) {
  const { getAllColumns } = table

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("ml-auto mr-2.5 font-normal rounded-lg icon-wrapper", className)}
          variant={variant}
          size={size}
          {...props}
        >
          <span>Show Columns</span>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem className="capitalize"
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.columnDef.header?.toString()}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export {
  DataTable,
  DataTableSelectionInfo,
  DataTablePagination,
  DataTableColumnToggle,
  getSelectionColumn,
  getDefaultSelectedRows
}
