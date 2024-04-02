import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

// types
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query"
import { Pagination } from "@/services/api/types"

type PaginationOptions<D> = {
  data: InfiniteData<Pagination<D>, unknown> | undefined
  fetchNextPage: (options?: FetchNextPageOptions | undefined) =>
    Promise<InfiniteQueryObserverResult<InfiniteData<Pagination<D>, unknown>, Error>>
  disableScrolling?: boolean
  maxItemLimit?: number
  actionAfterLimitExceeded?: () => void
}

const usePagination = <D,>({
  data, fetchNextPage, disableScrolling, maxItemLimit, actionAfterLimitExceeded
}: PaginationOptions<D>) => {
  const lastPage = data?.pages[data.pages.length - 1]
  const isLimitExceeded = !!maxItemLimit &&
    !!lastPage?.nextPageOffset && lastPage.nextPageOffset >= maxItemLimit

  const { ref, inView } = useInView()
  
  useEffect(() => {
    if (inView && !disableScrolling && !isLimitExceeded) fetchNextPage()
  }, [fetchNextPage, inView, disableScrolling, isLimitExceeded])

  const manualPagination = () => {
    if (!isLimitExceeded) {
      fetchNextPage()
      return
    }

    actionAfterLimitExceeded && actionAfterLimitExceeded()
  }

  return { lastPage, isLimitExceeded, manualPagination, observerRef: ref }
}

export default usePagination
