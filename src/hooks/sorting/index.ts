import { useSearchParams } from "react-router-dom"

// types
import { Sort } from "@/services/api/types"
import { SortHookReturn } from "@/hooks/sorting/types"

// utils
import { convertToParam, getSort, handleOrderToggle } from "@/hooks/sorting/utils"

function useSorting(defaultSort: Sort = {}): SortHookReturn {
  const [params, setParams] = useSearchParams()

  const toggleSort = (key: string, fixedOrder?: 1 | -1) => {
    setParams((params) => {
      const sortBy = getSort(params)
      const order = sortBy[key]

      const record = handleOrderToggle(key, fixedOrder || order, !!fixedOrder)      
      const param = convertToParam(record || defaultSort)

      params.set('sortBy', param)
      
      if (!param) params.delete('sortBy')
      return params
    })
  }

  return {
    sortBy: getSort(params),
    toggleSort
  }
}

export default useSorting
