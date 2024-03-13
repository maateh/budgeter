// components
import Note from "@/components/shared/budget-note/Note"

// hooks
import { useNotesbyStatus } from "@/lib/react-query/queries"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteList = {
  budget: Budget
  status: BudgetNote['status']
}

const NoteList = ({ budget, status }: NoteList) => {
  const { data: notes, isLoading } = useNotesbyStatus(budget.id, status)

  return !isLoading && notes ? notes.length ? (
    <ul className="w-full px-2 flex flex-wrap items-center gap-x-12 gap-y-4">
      {notes.map((note) => (
        <li key={note.id} className="w-full">
          <Note budget={budget} note={note} />
        </li>
      ))}
    </ul>
  ) : (
    <pre className="text-muted truncate">There are no recorded notes currently.</pre>
  ) : (
    <>Loading...</> // TODO: skeleton
  )
}

export default NoteList
