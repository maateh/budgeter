import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useSaveBudgetMutation } from "@/lib/react-query/mutations"

// types
import { BudgetSubmitProps, FieldValues } from "@/components/form/budget/types"

const useBudgetSubmit = (form: UseFormReturn<FieldValues['budget']>, { budgetId }: BudgetSubmitProps) => {
  const { mutateAsync: saveBudget, isPending } = useSaveBudgetMutation(budgetId)
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValues['budget']> = async (values) => {
    try {
      await saveBudget(values)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetSubmit
