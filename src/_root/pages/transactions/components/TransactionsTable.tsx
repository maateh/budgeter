// shadcn
import { DataTable, getSelectionColumn } from "@/components/ui/data-table"

// hooks
import { useTransactionsPagination } from "@/lib/react-query/queries"
import { usePagination } from "@/hooks"

// types
import { ColumnDef } from "@tanstack/react-table"
import { Budget, Transaction } from "@/services/api/types"

// TODO: add and design required columns
const columns: ColumnDef<(Transaction & { budget: Budget })>[] = [
  // TODO: selection is required to bulk delete selected transactions
  getSelectionColumn(),
  {
    accessorKey: "name",
    header: "Name"
  }
]

const TransactionsTable = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useTransactionsPagination({
    params: { limit: 20, offset: 0 }
  })

  const { observerRef } = usePagination({ data, fetchNextPage })

  return !isLoading && data && (
    <>
      <DataTable
        columns={columns}
        data={data.pages.flatMap((page) => page.data)}
      />

      <div ref={observerRef}>
        {isFetchingNextPage && <>Loading...</>} {/* TODO: skeleton */}
      </div>
    </>
  )
}

export default TransactionsTable
