import { useState } from "react"
import { format } from "date-fns"

// icons
import { CalendarCheck, CalendarPlus, CheckCircle, PenLine, PenSquare, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import BudgetNoteForm from "@/components/form/budget-note/BudgetNoteForm"
import NoteDeletion from "@/components/shared/budget-note/NoteDeletion"

// hooks
import { useUpdateNoteStatus } from "@/lib/react-query/mutations"

// context
import FormProvider from "@/services/providers/form/FormProvider"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteProps = {
  budget: Budget
  note: BudgetNote
}

const Note = ({ budget, note }: NoteProps) => {
  const [editingMode, setEditingMode] = useState(false)

  const { mutateAsync: updateNoteStatus } = useUpdateNoteStatus(budget.id, note.id)

  const handleClose = async () => {
    try {
      await updateNoteStatus({
        budgetId: budget.id,
        noteId: note.id,
        status: note.status === 'open' ? 'closed' : 'open'
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className="my-1 px-7 pt-6 pb-3 flex flex-col gap-y-2 bg-foreground/15 border-xl border-b-2 border-r-4 hover:opacity-95"
      style={{
        borderColor: budget.theme.background,
        opacity: note.status === 'closed' ? 0.65 : 1
      }}
    >
      <div className="h-max mx-2.5 font-medium">
        {editingMode ? (
          <FormProvider cleanForm={() => setEditingMode(false)}>
            <BudgetNoteForm
              budgetId={budget.id}
              note={note}
              cancelAction={() => setEditingMode(false)}
            />
          </FormProvider>
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
            {note.status === 'open' ? (
              <CheckCircle
                size={16}
                strokeWidth={2.5}
                className="text-green-600 dark:text-green-400"
              />
            ) : (
              <Undo2
                size={16}
                strokeWidth={2.5}
                className="text-orange-600 dark:text-orange-400"
              />
            )}
          </Button>
          
          <Button
            variant="icon"
            size="icon-sm"
            className="bg-primary border-4 border-primary/60"
            onClick={() => setEditingMode(prev => !prev)}
            disabled={note.status === 'closed'}
          >
            <PenSquare
              size={16}
              strokeWidth={2.5}
              className="text-accent"
            />
          </Button>

          <NoteDeletion note={note} budget={budget} />
        </div>

        <div className="font-heading all-small-caps icon-wrapper">
          {note.closedAt ? (
            <>
              <p>{format(note.closedAt, 'PPP')}</p>
              <CalendarCheck size={18} strokeWidth={1.7} />
            </>
          ) : note.editedAt ? (
            <>
              <p>{format(note.editedAt, 'PPP')}</p>
              <PenLine size={18} strokeWidth={1.7} />
            </>
          ) : (
            <>
              <p>{format(note.createdAt, 'PPP')}</p>
              <CalendarPlus size={18} strokeWidth={1.7} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Note
