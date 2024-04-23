// types
import { SearchSort } from "@/hooks/sorting/types"

function handleOrderToggle(key: string, currentOrder?: '1' | '-1', isFixed: boolean = false): SearchSort {
  if (isFixed && currentOrder) return { [key]: currentOrder.toString() as '1' | '-1' }

  if (!currentOrder) return { [key]: '1' }
  if (currentOrder === '1') return { [key]: '-1' }

  return { [key]: undefined }
}

export { handleOrderToggle }
