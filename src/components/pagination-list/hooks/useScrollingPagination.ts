import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

// types
import { PaginationProps } from "@/components/pagination-list/types"

const useScrollingPagination = <D,>({ data, fetchNextPage }: PaginationProps<D>) => {
  const { ref, inView } = useInView()

  const lastPage = data?.pages[data.pages.length - 1]

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView])

  return { lastPage, observerRef: ref }
}

export default useScrollingPagination
