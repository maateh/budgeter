// types
import { BudgetNote } from "@/models/Budget"

// components
import Note from "./Note"

type NoteList = {
  notes: BudgetNote[]
}

const NoteList = ({ notes }: NoteList) => {
  return notes && notes.length ? (
    <ul className="w-full px-2 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
      {notes.map((note) => (
        <li key={note.id}>
          <Note note={note} />
        </li>
      ))}
    </ul>
  ) : (
    <pre className="text-muted">There are no recorded notes currently.</pre>
  )
}

export default NoteList
