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

const usePagination = <D,>({ data, fetchNextPage, disableScrolling, maxItemLimit, actionAfterLimitExceeded }: PaginationOptions<D>) => {
  const lastPage = data?.pages[data.pages.length - 1]

  /** 
   * Checks whether there is a next page offset available or not.
   * 
   * Note: 'maxItemLimit' can be given for the pagination which
   * limits the maximum amount of items even if more items are available.
   */
  const isLimitExceeded = !!maxItemLimit &&
    !!lastPage?.nextPageOffset && lastPage.nextPageOffset >= maxItemLimit

  /**
   * Handles infinite manual pagination.
   * 
   * Usage: 'manualPagination' can be given as
   * an onClick event for a button.
   */
  const manualPagination = () => {
    if (!isLimitExceeded) {
      fetchNextPage()
      return
    }
    actionAfterLimitExceeded && actionAfterLimitExceeded()
  }

  /**
   * Handles infinite scrolling pagination.
   * 
   * Usage: 'ref' can be given as a ref for an HTML element
   * and if it's in the view the query will be executed
   * automatically.
   */
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && !disableScrolling && !isLimitExceeded) fetchNextPage()
  }, [fetchNextPage, inView, disableScrolling, isLimitExceeded])

  return { lastPage, isLimitExceeded, manualPagination, observerRef: ref }
}

export default usePagination
