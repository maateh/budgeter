// icons
import { PlusCircle, Search } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumnToggle, DataTablePagination } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useTransactionsControlledPagination } from "@/lib/react-query/queries"
import { useDialog, useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"

// table columns
import { columns } from "./columns"

const TransactionsTable = () => {
  const { openDialog } = useDialog()

  const {
    params, pagination, filterBy, excludeBy,
    setPagination, setFilterParam, removeFilterParam, toggleFilterType
  } = useFilter<Transaction>({
    pageSize: 10
  })

  const { data: currentPage, isLoading } = useTransactionsControlledPagination({
    params: pagination.params,
    filter: { filterBy, excludeBy, partialMatch: true }
  })

  return !isLoading && currentPage && (
    <>
      <div className="flex flex-wrap-reverse justify-between items-center gap-x-14 gap-y-4">
        <FilterInput className="flex-1 max-w-md" // TODO: add debounce
          label={<>Search by <span className="text-accent overline">Name</span></>}
          labelProps={{ htmlFor: 'name' }}
          onTypeChange={(filterType) => toggleFilterType('name', filterType)}
          onReset={(filterType) => removeFilterParam('name', filterType)}
        >
          {(filterType) => (
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 transform" size={18} />
              <Input id="name" className="min-w-48 h-full pl-10 rounded-lg"
                type="text"
                placeholder="Search transactions..."
                value={params.name as string || ''}
                onChange={(event) => setFilterParam({ name: event.target.value }, filterType)}
              />
            </div>
          )}
        </FilterInput>

        <Button className="flex-1 max-w-48 ml-auto icon-wrapper"
          onClick={() => openDialog('/transactions/create')}
        >
          <PlusCircle size={18} strokeWidth={3} />
          <span className="small-caps font-semibold">New Transaction</span>
        </Button>
      </div>

      <Separator className="my-3.5 py-[1px] rounded-full bg-foreground/60" />

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
          <div className="min-w-64 py-3.5 px-3.5 flex flex-wrap justify-between items-center gap-x-2.5 gap-y-3 bg-primary rounded-3xl">
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
