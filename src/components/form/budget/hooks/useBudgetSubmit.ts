import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useSaveBudgetMutation } from "@/hooks/mutations"

// models
import Budget, { BudgetType } from "@/models/Budget"

// types
import { BudgetSubmitProps, FieldValues } from "@/components/form/budget/types"

const useBudgetSubmit = (form: UseFormReturn<FieldValues['budget']>, { type, budget }: BudgetSubmitProps) => {
  const { mutateAsync: saveBudget, isPending } = useSaveBudgetMutation(budget?.id)
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValues['budget']> = async (values) => {
    if (type === 'create' && values.type === BudgetType.EXPENSE) {
      values.balance.current = values.balance.ceiling
    }

    const id = budget?.id || crypto.randomUUID()
    budget = new Budget(id, values)

    try {
      await saveBudget(budget)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetSubmit
