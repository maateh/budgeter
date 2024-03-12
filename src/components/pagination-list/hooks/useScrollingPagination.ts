import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

// types
import { PaginationProps } from "@/components/pagination/types"

const useScrollingPagination = <D,>({ data, fetchNextPage, maxItemLimit }: PaginationProps<D>) => {
  const { ref, inView } = useInView()

  const lastPage = data?.pages[data.pages.length - 1]

  useEffect(() => {
    console.log({lastPage})
    console.log({maxItemLimit})
    if (maxItemLimit && lastPage?.nextPageOffset && lastPage.nextPageOffset >= maxItemLimit) return
    if (inView) fetchNextPage()
  }, [fetchNextPage, inView, lastPage, maxItemLimit])

  return { lastPage, observerRef: ref }
}

export default useScrollingPagination
