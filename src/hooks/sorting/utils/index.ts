// types
import { SearchSort } from "@/hooks/sorting/types"

/**
 * Toggles the sorting order for the specified entry key.
 * 
 * - If the current order is not fixed and not set, it sets the order to ascending ('1').
 * - If the current order is ascending ('1'), it changes it to descending ('-1').
 * - If the current order is descending ('-1'), it resets the order for the specified key.
 * 
 * @param {string} key - The key of the entry to toggle sorting for.
 * @param {'1' | '-1'} [currentOrder] - The current sorting order.
 * @param {boolean} [isFixed=false] - Indicates if the sorting order should be fixed.
 * @returns {SearchSort} The updated sorting criteria.
 */
function handleOrderToggle(key: string, currentOrder?: '1' | '-1', isFixed: boolean = false): SearchSort {
  if (isFixed && currentOrder) return { [key]: currentOrder.toString() as '1' | '-1' }

  if (!currentOrder) return { [key]: '1' }
  if (currentOrder === '1') return { [key]: '-1' }

  return { [key]: undefined }
}

export { handleOrderToggle }
