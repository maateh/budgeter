import { useEffect, useState } from "react"

// types
import { DebounceHookOptions, DebounceHookReturn } from "@/hooks/debounce/types"

function useDebounce<T>({ value, delay = 450 }: DebounceHookOptions<T>): DebounceHookReturn<T> {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return { debouncedValue }
}

export default useDebounce
