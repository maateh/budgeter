import { FilterOptions, PaginationParams } from "@/services/api/types"

export type QueryOptions<T> = {
  params?: PaginationParams
  filter?: FilterOptions<T>
}
