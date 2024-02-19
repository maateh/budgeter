import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useUpdateBudgetMutation } from "@/hooks/mutations"

// types
import { BudgetNoteSubmitProps, FieldValues } from "@/components/form/budget/types"

const useBudgetNoteSubmit = (form: UseFormReturn<FieldValues['note']>, { budget, note }: BudgetNoteSubmitProps) => {
  const { mutateAsync: updateBudget, isPending } = useUpdateBudgetMutation(budget.id)
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValues['note']> = async (values) => {
    budget.saveNote({
      id: note?.id || crypto.randomUUID(),
      date: {
        created: note?.date.created || new Date(),
        edited: note ? new Date() : undefined,
        ...note?.date
      },
      ...values,
    })
  
    try {
      await updateBudget(budget)
  
      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetNoteSubmit
