import { useState } from "react"
import { format } from "date-fns"

// icons
import { CalendarCheck, CalendarPlus, CheckCircle, PenLine, PenSquare, Trash2, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import BudgetNoteForm from "@/components/form/budget/BudgetNoteForm"
import ConfirmationDialog from "@/components/shared/ConfirmationDialog"

// hooks
import { useChangeNoteStatusMutation, useRemoveNoteMutation } from "./Note.hooks"

// types
import Budget, { BudgetNote } from "@/models/Budget"

type NoteProps = {
  budget: Budget
  note: BudgetNote
}

const Note = ({ budget, note }: NoteProps) => {
  const { mutateAsync: changeNoteStatus } = useChangeNoteStatusMutation(budget.id)
  const { mutateAsync: removeNote } = useRemoveNoteMutation(budget.id)

  const [editingMode, setEditingMode] = useState(false)

  const handleClose = async () => {
    try {
      await changeNoteStatus({
        budget,
        noteId: note.id,
        status: note.date.closed
          ? 'open'
          : 'closed'
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async () => {
    try {
      await removeNote({ budget, noteId: note.id })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className="my-1 px-7 pt-6 pb-3 flex flex-col gap-y-2 bg-foreground/15 border-xl border-b-2 border-r-4 hover:opacity-95"
      style={{
        borderColor: budget.theme.background,
        opacity: note.date.closed && 0.65
      }}
    >
      <div className="h-max mx-2.5 font-medium">
        {editingMode ? (
          <BudgetNoteForm
            budget={budget}
            note={note}
            cleanForm={() => setEditingMode(false)}
            cancelAction={() => setEditingMode(false)}
          />
        ) : (
          <p className="break-words whitespace-break-spaces tracking-wide">
            {note.text}
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-center gap-x-4">
        <div className="flex items-center gap-x-2">
          <Button
            variant="icon"
            size="icon-sm"
            className="bg-primary border-4 border-primary/60"
            onClick={handleClose}
          >
            {note.date.closed ? (
              <Undo2
                size={16}
                strokeWidth={2.5}
                className="text-orange-600 dark:text-orange-400"
              />
            ) : (
              <CheckCircle
                size={16}
                strokeWidth={2.5}
                className="text-green-600 dark:text-green-400"
              />
            )}
          </Button>
          
          <Button
            variant="icon"
            size="icon-sm"
            className="bg-primary border-4 border-primary/60"
            onClick={() => setEditingMode(prev => !prev)}
            disabled={!!note.date.closed}
          >
            <PenSquare
              size={16}
              strokeWidth={2.5}
              className="text-accent"
            />
          </Button>

          <ConfirmationDialog
            title="Do you really want to remove this note?"
            message={note.text}
            variant="confirm-negative"
            confirm={handleRemove}
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
        </div>

        <div className="font-heading all-small-caps icon-wrapper">
          {note.date.closed ? (
            <>
              <p>{format(note.date.closed, 'PPP')}</p>
              <CalendarCheck size={18} strokeWidth={1.7} />
            </>
          ) : note.date.edited ? (
            <>
              <p>{format(note.date.edited, 'PPP')}</p>
              <PenLine size={18} strokeWidth={1.7} />
            </>
          ) : (
            <>
              <p>{format(note.date.created, 'PPP')}</p>
              <CalendarPlus size={18} strokeWidth={1.7} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Note
