// types
import { PaginationOptions } from "@/components/pagination-list/types"

type ManualPaginationOptions<D> = {
  maxItemLimit?: number
  actionAfterLimitExceeded?: () => void
} & PaginationOptions<D>

const useManualPagination = <D,>({
  data, fetchNextPage, maxItemLimit, actionAfterLimitExceeded
}: ManualPaginationOptions<D>) => {
  const lastPage = data?.pages[data.pages.length - 1]
  const isLimitExceeded = !!maxItemLimit &&
    !!lastPage?.nextPageOffset && lastPage.nextPageOffset >= maxItemLimit

  const handlePagination = () => {
    if (!isLimitExceeded) {
      fetchNextPage()
      return
    }

    actionAfterLimitExceeded && actionAfterLimitExceeded()
  }

  return { lastPage, isLimitExceeded, handlePagination }
}

export default useManualPagination
