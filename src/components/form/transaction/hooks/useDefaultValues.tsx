// constants
import { defaultValues } from "@/components/form/transaction/constants"

const useDefaultValues = (budgetId?: string) => {
  return {
    defaultValues: {
      ...defaultValues,
      budgetId
    }
  }
}

export default useDefaultValues
