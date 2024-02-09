import { format } from "date-fns"

// icons
import { CalendarPlus, CheckCircle, PenLine, PenSquare, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// types
import Budget, { BudgetNote } from "@/models/Budget"

type NoteProps = {
  budget: Budget
  note: BudgetNote
}

const Note = ({ budget, note }: NoteProps) => {
  const handleClose = () => {
    // TODO: close note
  }

  const handleEdit = () => {
    // TODO: implement note editing mode
  }

  return (
    <div
      className="my-1 px-7 pt-6 pb-3 flex flex-col gap-y-2 bg-foreground/15 border-xl border-b-2 border-r-4 hover:opacity-95"
      style={{
        borderColor: budget.theme.background,
        opacity: note.date.closed ? 0.65 : 1
      }}
    >
      <p className="font-medium whitespace-pre-line">{note.text}</p>

      <Separator />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <Button
            variant="icon"
            size="icon-sm"
            className="bg-primary border-4 border-primary/60"
            onClick={handleClose}
          >
            {!note.date.closed ? (
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
            onClick={handleEdit}
            disabled={!!note.date.closed}
          >
            <PenSquare
              size={16}
              strokeWidth={2.5}
              className="text-accent"
            />
          </Button>
        </div>

        <div className="font-heading all-small-caps icon-wrapper">
          {note.date.edited ? (
            <>
              <p>{format(note.date.edited, 'PPP')}</p>
              <PenLine />
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
