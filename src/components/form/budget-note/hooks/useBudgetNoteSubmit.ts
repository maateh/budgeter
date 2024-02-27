import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useSaveNote } from "@/lib/react-query/mutations"

// types
import { BudgetNoteSubmitProps, BudgetNoteFieldValues } from "@/components/form/budget-note/types"

const useBudgetNoteSubmit = (form: UseFormReturn<BudgetNoteFieldValues>, { budgetId, noteId }: BudgetNoteSubmitProps) => {
  const { cleanForm } = useFormContext()
  
  const { mutateAsync: saveNote, isPending } = useSaveNote(budgetId, noteId)

  const onSubmit: SubmitHandler<BudgetNoteFieldValues> = async (values) => { 
    try {
      await saveNote({
        budgetId,
        noteId,
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

export default useBudgetNoteSubmit
