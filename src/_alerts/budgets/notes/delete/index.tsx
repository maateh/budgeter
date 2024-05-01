import { Location, useLocation, useNavigate, useParams } from "react-router-dom"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useDeleteNote } from "@/lib/react-query/mutations"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type DeleteNoteState = {
  note: BudgetNote
  budget: Budget
}

const DeleteNote = () => {
  const { budgetId, id } = useParams() as { budgetId: string; id: string }
  const { state: { note, budget }} = useLocation() as Location<DeleteNoteState>
  const navigate = useNavigate()

  const { toast } = useToast()

  const { mutateAsync: deleteNote } = useDeleteNote(budgetId, id)

  const deleteConfirm = async () => {
    try {
      await deleteNote({
        budgetId,
        noteId: id
      })

      navigate(-1)
      toast({
        variant: 'destructive',
        title: 'Deleted: Budget note',
        description: `Note has been successfully deleted from "${budget.name}" budget.`
      })
    } catch (err) {
      console.error(err)
      
      toast({
        variant: 'destructive',
        title: `Oops! Failed to delete note.`,
        description: 'Please try again.'
      })
    }
  }
  
  return (
    <AlertDialogContent variant="negative">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete note from: {budget.name}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <Separator />

      <AlertDialogDescription className="break-all whitespace-break-spaces overflow-clip">
        {note.text}
      </AlertDialogDescription>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => navigate(-1)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={deleteConfirm}>
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export default DeleteNote
