import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { Filter, FilterKeys, FilterOptions, PaginationParams } from "@/services/api/types"

export type FilterRecord<T> = Partial<Record<keyof T, string>>

export type FilterHookOptions = {
  pageSize?: number
}

export type FilterSearchParams<T> = {
  [K in FilterKeys]: Filter<T>
}

export type FilterHookReturn<T> = FilterOptions<T> & {
  pagination: {
    pageIndex: number
    pageSize: number
    params: PaginationParams
  }
  searchParams: FilterSearchParams<T>
  filterParams: Filter<T>
  setPagination: OnChangeFn<PaginationState>
  setFilterParam: (item: FilterRecord<T>, type: FilterKeys) => void
  removeFilterParam: (key: keyof T, type: FilterKeys) => void
  toggleFilterType: (key: keyof T, type: FilterKeys) => void
}
