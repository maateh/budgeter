import { FilterOptions, PaginationParams, Sort } from "@/services/api/types"

export type QueryOptions<T> = {
  params?: PaginationParams
  filter?: FilterOptions<T>
  sortBy?: Sort
}
