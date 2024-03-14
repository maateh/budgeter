import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

// types
import { PaginationOptions } from "@/components/pagination-list/types"

type ScrollingPaginationOptions<D> = {
  disableScrolling?: boolean
} & PaginationOptions<D>

const useScrollingPagination = <D,>({ data, fetchNextPage, disableScrolling }: ScrollingPaginationOptions<D>) => {
  const { ref, inView } = useInView()

  const lastPage = data?.pages[data.pages.length - 1]

  useEffect(() => {
    if (inView && !disableScrolling) fetchNextPage()
  }, [fetchNextPage, inView, disableScrolling])

  return { lastPage, observerRef: ref }
}

export default useScrollingPagination
