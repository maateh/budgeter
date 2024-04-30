// components
import Listing from "@/components/ui/custom/Listing"
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
    <Listing className="w-full px-2 flex flex-wrap items-center gap-x-12 gap-y-4"
      fallbackProps={{
        className: 'mr-auto',
        value: "There is no recorded note to display."
      }}
      itemProps={{ className: "w-full" }}
      pages={data.pages}
    >
      {(note) => <Note budget={budget} note={note} />}
    </Listing>
  ) : <>Loading...</> // TODO: skeleton
}

export default NoteList
