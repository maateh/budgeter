// types
import { Budget, BudgetNote } from "@/services/api/types"

// components
import Note from "@/components/shared/Note"

type NoteList = {
  budget: Budget
  notes: BudgetNote[]
}

const NoteList = ({ budget, notes }: NoteList) => {
  return notes && notes.length ? (
    <ul className="w-full px-2 flex flex-wrap items-center gap-x-12 gap-y-4">
      {notes.map((note) => (
        <li key={note.id} className="w-full">
          <Note budget={budget} note={note} />
        </li>
      ))}
    </ul>
  ) : (
    <pre className="text-muted truncate">There are no recorded notes currently.</pre>
  )
}

export default NoteList
