import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { Filter, FilterOptions, PaginationParams } from "@/services/api/types"

export type FilterType = 'filterBy' | 'excludeBy'

export type FilterRecord<T> = Record<keyof T, string>

export type FilterHookOptions = {
  pageSize?: number
}

export type FilterHookReturn<T> = FilterOptions<T> & {
  pagination: {
    pageIndex: number
    pageSize: number
    params: PaginationParams
  }
  filterBy?: Filter<T>
  excludeBy?: Filter<T>
  setPagination: OnChangeFn<PaginationState>
  setFilterParam: (item: FilterRecord<T>, type: FilterType) => void
  removeFilterParam: (key: keyof T, type: FilterType) => void
}
