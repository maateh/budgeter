// types
import { PaginationProps } from "@/components/pagination-list/types"

type ManualPaginationProps<D> = {
  maxItemLimit?: number
  actionAfterLimitExceeded?: () => void
} & PaginationProps<D>

const useManualPagination = <D,>({
  data, fetchNextPage, maxItemLimit, actionAfterLimitExceeded
}: ManualPaginationProps<D>) => {
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
