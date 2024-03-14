import { UUID } from "crypto"
import { useNavigate, useParams } from "react-router-dom"

// shadcn
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useNoteWithBudget } from "@/lib/react-query/queries"
import { useDeleteNote } from "@/lib/react-query/mutations"

const DeleteNote = () => {
  const { budgetId, id } = useParams() as { budgetId: UUID, id: UUID }
  const navigate = useNavigate()

  const { data: note, isLoading } = useNoteWithBudget(budgetId, id)
  const { mutateAsync: deleteNote } = useDeleteNote(budgetId, id)

  const deleteConfirm = async () => {
    try {
      await deleteNote({
        budgetId: budgetId,
        noteId: id
      })
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <AlertDialogContent variant="negative">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Delete note from: {!isLoading && note ? note.budget.name : <>Loading...</> /*TODO: skeleton*/}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <Separator />

      <AlertDialogDescription className="break-all whitespace-break-spaces overflow-clip">
        {!isLoading && note ? note.text : <>Loading...</> /*TODO: skeleton*/}
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
