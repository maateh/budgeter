// types
import { Pagination, QueryOptions } from "@/services/api/types"

// utils
import { filter, rangeFilter, sort } from "@/services/storage/utils"

/**
 * Paginates the given data based on the provided offset and limit.
 * @param data - The array of data to paginate.
 * @param offset - The starting index of the pagination.
 * @param limit - The maximum number of items per page.
 * @returns An object containing paginated data and metadata.
 */
export function paginate<D>(data: D[], { params, filter: filterOptions, sortBy }: QueryOptions<D> = {}): Pagination<D> {
  const { offset = 0, limit = -1, maxItemLimit } = params || {}
  const { rangeBy } = filterOptions || {}

  /** Filter out data before paginate */
  data = filter(data, filterOptions)
  data = rangeFilter(data, rangeBy)

  /**
   * If 'maxItemLimit' is specified we have to override the current
   * offset limit if 'maxItemLimit' is less than the actual, so as
   * not to exceed the maximum amount of items.
   */
  const currentOffsetLimit = maxItemLimit ? Math.min(offset + limit, maxItemLimit) : offset + limit

  /**
   * Determines the next page offset based on the current offset
   * and limit, considering the maximum item limit if specified.
   */
  const fixedLength = maxItemLimit ? Math.min(data.length, maxItemLimit) : data.length
  const nextPageOffset = limit > -1
    ? currentOffsetLimit < fixedLength ? currentOffsetLimit : null
    : null

  const sortedData = sort(data, sortBy)

  return {
    offset,
    limit,
    maxItemLimit: maxItemLimit || data.length,
    nextPageOffset,
    total: data.length,
    data: limit > -1 ? sortedData.slice(offset, currentOffsetLimit) : sortedData
  }
}
