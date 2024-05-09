import { useState } from "react"
import { format } from "date-fns"

// icons
import { CalendarCheck, CalendarPlus, CheckCircle, PenLine, PenSquare, Trash2, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import BudgetNoteForm from "@/components/form/budget-note/BudgetNoteForm"

// hooks
import { useDialog } from "@/hooks"
import { useUpdateNoteStatus } from "@/lib/react-query/mutations"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteProps = {
  budget: Budget
  note: BudgetNote
}

const Note = ({ budget, note }: NoteProps) => {
  const [editingMode, setEditingMode] = useState(false)

  const { openDialog } = useDialog()

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
    <div className="px-6 pt-5 pb-3 flex flex-col gap-y-2 bg-primary/80 rounded-3xl border-b-2 shadow-md shadow-primary/55"
      style={{
        borderColor: budget.theme,
        opacity: note.status === 'closed' ? 0.65 : 1
      }}
    >
      <div className="h-max mx-2.5 font-medium">
        {editingMode ? (
          <BudgetNoteForm
            type="edit"
            budgetId={budget.id}
            note={note}
            onSubmitted={() => setEditingMode(false)}
            onCancel={() => setEditingMode(false)}
          />
        ) : (
          <p className="font-semibold break-words whitespace-break-spaces tracking-wide">
            {note.text}
          </p>
        )}
      </div>

      <Separator className="w-11/12 mx-auto" />

      <div className="flex justify-between items-center gap-x-4">
        <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1.5">
          <Button className="p-2 hover:bg-secondary/35"
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            {note.status === 'open' ? (
              <CheckCircle className="text-green-600 dark:text-green-400"
                size={16}
                strokeWidth={2.5}
              />
            ) : (
              <Undo2 className="text-orange-600 dark:text-orange-400"
                size={16}
                strokeWidth={2.5}
              />
            )}
          </Button>
          
          <Button className="p-2 hover:bg-secondary/35"
            variant="ghost"
            size="icon"
            onClick={() => setEditingMode(prev => !prev)}
            disabled={note.status === 'closed'}
          >
            <PenSquare className="text-accent"
              size={16}
              strokeWidth={2.5}
            />
          </Button>

          <Button className="p-2 hover:bg-secondary/35"
            variant="ghost"
            size="icon"
            onClick={() => {
              openDialog(`/budgets/${budget.id}/notes/delete/${note.id}`, {}, { note, budget })
            }}
          >
            <Trash2 className="text-destructive"
              size={16}
              strokeWidth={2.5}
            />
          </Button>
        </div>

        <div className="font-heading text-xs text-end icon-wrapper">
          {note.closedAt ? (
            <>
              <p>{format(note.closedAt, 'PPP')}</p>
              <CalendarCheck size={16} strokeWidth={1.85} />
            </>
          ) : note.editedAt ? (
            <>
              <p>{format(note.editedAt, 'PPP')}</p>
              <PenLine size={16} strokeWidth={1.85} />
            </>
          ) : (
            <>
              <p>{format(note.createdAt, 'PPP')}</p>
              <CalendarPlus size={16} strokeWidth={1.85} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Note
