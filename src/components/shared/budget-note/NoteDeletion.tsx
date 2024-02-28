// icons
import { Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import ConfirmationDialog from "@/components/ui/custom/ConfirmationDialog"

// hooks
import { useDeleteNote } from "@/lib/react-query/mutations"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteDeletionProps = {
  note: BudgetNote
  budget: Budget
}

const NoteDeletion = ({ note, budget }: NoteDeletionProps) => {
  const { mutateAsync: deleteNote } = useDeleteNote(budget.id, note.id)

  const handleDelete = async () => {
    try {
      await deleteNote({
        budgetId: budget.id,
        noteId: note.id
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ConfirmationDialog
      title={`Delete note from: ${budget.name}`}
      description={note.text}
      variant="negative"
      action={handleDelete}
    >
      <Button
        variant="icon"
        size="icon-sm"
        className="bg-primary border-4 border-primary/60"
      >
        <Trash2
          size={16}
          strokeWidth={2.5}
          className="text-destructive"
        />
      </Button>
    </ConfirmationDialog>
  )
}

export default NoteDeletion
