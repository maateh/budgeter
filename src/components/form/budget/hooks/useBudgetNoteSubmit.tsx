import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useSaveNoteMutation } from "@/components/form/budget/hooks"
import { useFormContext } from "@/services/providers/form/FormContext.hooks"

// types
import { BudgetNoteSubmitProps, FieldValues } from "@/components/form/budget/types"

const useBudgetNoteSubmit = (form: UseFormReturn<FieldValues['note']>, { budget, note }: BudgetNoteSubmitProps) => {
  const { mutateAsync: saveNote, isPending } = useSaveNoteMutation(budget.id)
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValues['note']> = async (values) => {
    note = {
      id: note?.id || crypto.randomUUID(),
      date: {
        created: note?.date.created || new Date(),
        edited: note ? new Date() : undefined,
        ...note?.date
      },
      ...values,
    }
  
    try {
      await saveNote({ budget, note })
  
      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetNoteSubmit
