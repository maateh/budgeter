import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useSaveNote } from "@/lib/react-query/mutations"

// types
import { BudgetNoteSubmitProps, BudgetNoteFieldValues } from "@/components/form/budget-note/types"

const useBudgetNoteSubmit = (form: UseFormReturn<BudgetNoteFieldValues>, props: BudgetNoteSubmitProps) => {
  const { budgetId, noteId, onSubmitted } = props
  
  const { mutateAsync: saveNote, isPending } = useSaveNote(budgetId, noteId)

  const onSubmit: SubmitHandler<BudgetNoteFieldValues> = async (values) => { 
    try {
      await saveNote({
        budgetId,
        noteId,
        data: values
      })
  
      form.reset()
      onSubmitted()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetNoteSubmit
