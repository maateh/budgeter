import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query"
import { Pagination } from "@/services/api/types"

export type PaginationOptions<D> = {
  data: InfiniteData<Pagination<D>, unknown> | undefined
  fetchNextPage: (options?: FetchNextPageOptions | undefined) =>
    Promise<InfiniteQueryObserverResult<InfiniteData<Pagination<D>, unknown>, Error>>
  maxItemLimit?: number
  actionAfterLimitExceeded?: () => void
  disableScrolling?: boolean
}
