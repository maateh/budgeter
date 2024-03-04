// shadcn
import { Button, ButtonProps } from "@/components/ui/button"

// components
import ConfirmationDialog from "@/components/ui/custom/ConfirmationDialog"

// hooks
import { useDeleteNote } from "@/lib/react-query/mutations"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteDeletionProps = {
  note: BudgetNote
  budget: Budget
} & React.HTMLAttributes<HTMLButtonElement> & ButtonProps

const NoteDeletion = ({ note, budget, children, variant = 'icon', size = 'icon', ...props }: NoteDeletionProps) => {
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
      <Button variant={variant} size={size} {...props}>
        {children}
      </Button>
    </ConfirmationDialog>
  )
}

export default NoteDeletion
