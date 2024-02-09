import { format } from "date-fns"

// icons
import { CalendarPlus, PenLine } from "lucide-react"

// types
import { BudgetNote } from "@/models/Budget"

type NoteProps = {
  note: BudgetNote
}

const Note = ({ note }: NoteProps) => {
  return (
    <>
      <p>{note.text}</p>
      {note.date.edited ? (
        <div className="icon-wrapper">
          <p>{format(note.date.edited, 'PPP')}</p>
          <PenLine />
        </div>
      ) : (
        <div className="icon-wrapper">
          <p>{format(note.date.created, 'PPP')}</p>
          <CalendarPlus size={18} strokeWidth={1.7} />
        </div>
      )}
    </>
  )
}

export default Note
