// types
import { PaginationProps } from "@/components/pagination-list/types"

type ManualPaginationProps<D> = {
  actionAfterLimitExceeded?: () => void
} & PaginationProps<D>

const useManualPagination = <D,>({
  data, fetchNextPage, maxItemLimit, actionAfterLimitExceeded
}: ManualPaginationProps<D>) => {
  const lastPage = data?.pages[data.pages.length - 1]

  const handlePagination = () => {
    if (!maxItemLimit || lastPage?.nextPageOffset && lastPage.nextPageOffset < maxItemLimit) {
      fetchNextPage()
      return
    }

    actionAfterLimitExceeded && actionAfterLimitExceeded()
  }

  return { lastPage, handlePagination }
}

export default useManualPagination
