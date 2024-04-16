// shadcn
import { DataTable, DataTableColumnToggle, DataTablePagination } from "@/components/ui/data-table"

// hooks
import { useTransactionsControlledPagination } from "@/lib/react-query/queries"
import { useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"

// table columns
import { columns } from "./columns"

const TransactionsTable = () => {
  const { pagination, filterBy, excludeBy, setPagination } = useFilter<Transaction>({
    pageSize: 10
  })

  const { data: currentPage, isLoading } = useTransactionsControlledPagination({
    params: pagination.params,
    filter: { filterBy, excludeBy, partialMatch: true }
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
          <div className="min-w-64 py-3.5 px-2.5 flex flex-wrap justify-between gap-x-4 gap-y-3 bg-primary rounded-3xl">
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
