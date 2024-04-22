import { Sort } from "@/services/api/types"

export type SortHookReturn = {
  sortBy: Sort,
  toggleSort: (key: string, fixedOrder?: -1 | 1) => void
}
