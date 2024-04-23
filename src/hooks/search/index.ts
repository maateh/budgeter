import { useSearchParams } from "react-router-dom"

// types
import { SearchReturn } from "@/hooks/search/types"

// constants
import { ENTRY_SEPARATOR, PARAM_SPLITTER } from "@/hooks/search/constants"

function useSearch<ParamKeys extends string, T extends object>(): SearchReturn<ParamKeys, T> {
  const [searchParams, setSearchParams] = useSearchParams()

  const getParam = (key: ParamKeys): T => {
    const searchParam = searchParams.get(key)
    if (!searchParam) return {} as T
  
    const param: T = searchParam.split(PARAM_SPLITTER)
      .reduce((param, record) => {
        const [key, value] = record.split(ENTRY_SEPARATOR)
        return { ...param, [key]: value }
      }, {} as T)
  
    return param
  }

  const convertToSearchParam = (param: Partial<T>): string => {
    return Object.entries(param)
      .reduce((searchParam, [key, value]) => {
        if (!value) return searchParam

        const searchParamEntry = `${key}${ENTRY_SEPARATOR}${value}`
        return searchParam.concat(searchParamEntry)
      }, [] as string[])
      .join(PARAM_SPLITTER)
  }

  const setParam = (paramKey: ParamKeys, entry: Partial<T>) => {
    setSearchParams((searchParams) => {
      const searchParam = convertToSearchParam(entry)
      searchParams.set(paramKey, searchParam)
  
      if (!searchParam) searchParams.delete(paramKey)
      return searchParams
    })
  }

  const clearParam = (paramKey: ParamKeys) => {
    setSearchParams((searchParams) => {
      searchParams.delete(paramKey)
      return searchParams
    })
  }

  const setParamEntry = (paramKey: ParamKeys, entry: Partial<T> | undefined) => {
    const param = getParam(paramKey)
    setParam(paramKey, { ...param, ...entry })
  }

  const removeParamEntry = (paramKey: ParamKeys, entryKey: keyof T) => {
    setSearchParams((searchParams) => {
      const param = getParam(paramKey)
      delete param[entryKey]

      const searchParam = convertToSearchParam(param)
      searchParams.set(paramKey, searchParam)

      if (!searchParam) searchParams.delete(paramKey)
      return searchParams
    })
  }

  return {
    params: [], // TODO: get every params
    getParam, convertToSearchParam,
    setParamEntry, removeParamEntry, setParam, clearParam
  }
}

export default useSearch
