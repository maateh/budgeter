import { OnChangeFn, PaginationState } from "@tanstack/react-table"
import { FilterKeys, FilterOptions, PaginationParams } from "@/services/api/types"

export type FilterRecord<T> = Partial<Record<keyof T, string>>
export type SearchFilter<T> = {
  [K in keyof T]?: string
}

export type FilterHookOptions = {
  pageSize?: number
}

export type FilterSearchParams<T> = {
  [K in FilterKeys]: SearchFilter<T>
}

export type FilterHookReturn<T> = FilterOptions<T> & {
  pagination: {
    pageIndex: number
    pageSize: number
    params: PaginationParams
  }
  searchFilter: FilterSearchParams<T>
  filterEntries: SearchFilter<T>
  setPagination: OnChangeFn<PaginationState>
  setFilterEntry: (filterKey: FilterKeys, entry: SearchFilter<T>) => void
  removeFilterEntries: (filterKey: FilterKeys, entryKeys: (keyof T)[]) => void
  toggleFilterType: (filterKey: FilterKeys, entryKey: keyof T) => void
}
