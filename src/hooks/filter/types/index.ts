import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { Filter, FilterOptions, PaginationParams } from "@/services/api/types"

export type FilterRecord<T> = Partial<Record<keyof T, string>>

export type FilterHookOptions = {
  pageSize?: number
}

export type FilterHookReturn<T> = FilterOptions<T> & {
  pagination: {
    pageIndex: number
    pageSize: number
    params: PaginationParams
  }
  filterBy: Filter<T>
  excludeBy: Filter<T>
  params: Filter<T>
  setPagination: OnChangeFn<PaginationState>
  setFilterParam: (item: FilterRecord<T>, type: keyof FilterOptions<T>) => void
  removeFilterParam: (key: keyof T, type: keyof FilterOptions<T>) => void
  toggleFilterType: (key: keyof T, type: keyof FilterOptions<T>) => void
}
