import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useSaveNote } from "@/lib/react-query/mutations"

// types
import { BudgetNoteSubmitProps, BudgetNoteFieldValues } from "@/components/form/budget-note/types"

const useBudgetNoteSubmit = (form: UseFormReturn<BudgetNoteFieldValues>, props: BudgetNoteSubmitProps) => {
  const { budgetId, noteId, onSubmitted } = props

  const { toast } = useToast()
  
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
      
      toast({
        title: 'Created: Budget note',
        description: 'A note has been successfully added for your budget.'
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: `Oops! Failed to create budget note.`,
        description: 'Please try again.'
      })
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetNoteSubmit
