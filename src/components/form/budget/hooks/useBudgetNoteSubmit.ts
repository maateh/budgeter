import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useSaveNoteMutation } from "@/lib/react-query/mutations"

// types
import { BudgetNoteSubmitProps, FieldValues } from "@/components/form/budget/types"

const useBudgetNoteSubmit = (form: UseFormReturn<FieldValues['note']>, { budgetId, noteId }: BudgetNoteSubmitProps) => {
  const { mutateAsync: saveNote, isPending } = useSaveNoteMutation(budgetId, noteId)
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValues['note']> = async (values) => { 
    try {
      await saveNote(values)
  
      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetNoteSubmit
