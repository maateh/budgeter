import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useSaveBudget } from "@/lib/react-query/mutations"

// types
import { BudgetSubmitProps, BudgetFieldValues } from "@/components/form/budget/types"

const useBudgetSubmit = (form: UseFormReturn<BudgetFieldValues>, { budgetId }: BudgetSubmitProps) => {
  const { cleanForm } = useFormContext()
  
  const { mutateAsync: saveBudget, isPending } = useSaveBudget(budgetId)

  const onSubmit: SubmitHandler<BudgetFieldValues> = async (values) => {
    try {
      await saveBudget({
        id: budgetId,
        data: values
      })

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetSubmit
