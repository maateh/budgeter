import { useState } from "react"

// shadcn
import { DataTable, DataTableColumnToggle, DataTablePagination } from "@/components/ui/data-table"

// hooks
import { useTransactionsControlledPagination } from "@/lib/react-query/queries"

// types
import { PaginationState } from "@tanstack/react-table"

// table columns
import { columns } from "./columns"

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
