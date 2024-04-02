// components
import PaginationList from "@/components/pagination-list/PaginationList"
import Note from "@/components/shared/budget-note/Note"

// hooks
import { useNotesPagination } from "@/lib/react-query/queries"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteListProps = {
  budget: Budget
  status: BudgetNote['status']
}

const NoteList = ({ budget, status }: NoteListProps) => {
  const { data, isLoading } = useNotesPagination({
    filter: {
      filterBy: { budgetId: budget.id, status }
    }
  })

  return !isLoading && data ? (
    <PaginationList className="w-full px-2 flex flex-wrap items-center gap-x-12 gap-y-4"
      itemProps={{ className: "w-full" }}
      pages={data.pages}
    >
      {(note) => <Note budget={budget} note={note} />}
    </PaginationList>
  ) : <>Loading...</> // TODO: skeleton

  // <pre className="text-muted truncate">There are no recorded notes currently.</pre>
}

export default NoteList
