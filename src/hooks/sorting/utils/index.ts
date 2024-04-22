// types
import { Sort } from "@/services/api/types"

function convertToParam(sortBy: Sort): string {
  return Object.entries(sortBy)
    .reduce((param, [key, value]) => {
      if (!value) return param

      const item = `${key}:${value}`
      return param.concat(item)
    }, [] as string[])
    .join(',')
}

function getSort(params: URLSearchParams): Sort {
  const param = params.get('sortBy')
  if (!param) return {}

  const sortBy: Sort = param.split(',') // sortBy keys separator
    .reduce((sortBy, record) => {
      const [key, stringValue] = record.split(':') // key-value separator

      const value = parseInt(stringValue)
      if (isNaN(value)) return sortBy

      return { ...sortBy, [key]: value }
    }, {})

  return sortBy
}

function handleOrderToggle(key: string, currentOrder?: 1 | -1, isFixed: boolean = false): Sort | undefined {
  if (isFixed && currentOrder) return { [key]: currentOrder }

  if (!currentOrder) return{ [key]: 1 }
  if (currentOrder === 1) return { [key]: -1 }
  if (currentOrder === -1) return undefined
}

export { convertToParam, getSort, handleOrderToggle }
