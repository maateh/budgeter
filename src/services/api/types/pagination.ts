export type Pagination<T> = {
  data: T[]
  nextPageOffset: number | null
  total: number
} & PaginationParams

export type PaginationParams = {
  offset: number
  limit: number
  maxItemLimit?: number
}
