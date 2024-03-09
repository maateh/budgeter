import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { format } from "date-fns"

// icons
import { CalendarCheck, CalendarPlus, CheckCircle, PenLine, PenSquare, Trash2, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import BudgetNoteForm from "@/components/form/budget-note/BudgetNoteForm"

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
  const navigate = useNavigate()
  const location = useLocation()

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
          <FormProvider
            cleanForm={() => setEditingMode(false)}
            cancelAction={() => setEditingMode(false)}
          >
            <BudgetNoteForm
              type="edit"
              budgetId={budget.id}
              note={note}
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
          <Button className="bg-primary p-2 hover:bg-primary/75"
            variant="icon"
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
          
          <Button className="bg-primary p-2 hover:bg-primary/75"
            variant="icon"
            size="icon"
            onClick={() => setEditingMode(prev => !prev)}
            disabled={note.status === 'closed'}
          >
            <PenSquare className="text-accent"
              size={16}
              strokeWidth={2.5}
            />
          </Button>

          <Button className="bg-primary p-2 hover:bg-primary/75"
            variant="icon"
            size="icon"
            onClick={() => navigate(`/budgets/${budget.id}/notes/delete/${note.id}`, {
              state: { background: location }
            })}
          >
            <Trash2 className="text-destructive"
              size={16}
              strokeWidth={2.5}
            />
          </Button>
        </div>

        <div className="font-heading all-small-caps icon-wrapper">
          {note.closedAt ? (
            <>
              <p>{format(note.closedAt, 'PPP')}</p>
              <CalendarCheck size={16} strokeWidth={1.7} />
            </>
          ) : note.editedAt ? (
            <>
              <p>{format(note.editedAt, 'PPP')}</p>
              <PenLine size={16} strokeWidth={1.7} />
            </>
          ) : (
            <>
              <p>{format(note.createdAt, 'PPP')}</p>
              <CalendarPlus size={16} strokeWidth={1.7} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Note
