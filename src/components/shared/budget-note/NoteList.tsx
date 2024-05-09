// components
import Listing from "@/components/ui/custom/Listing"
import Note from "@/components/shared/budget-note/ui/Note"
import NoteListSkeleton from "@/components/shared/budget-note/NoteList.skeleton"

// hooks
import { usePagination } from "@/hooks"
import { useNotesPagination } from "@/lib/react-query/queries"

// types
import { Budget, BudgetNote } from "@/services/api/types"

type NoteListProps = {
  budget: Budget
  status: BudgetNote['status']
}

const NoteList = ({ budget, status }: NoteListProps) => {
  const { data: notes, isLoading, fetchNextPage, isFetchingNextPage } = useNotesPagination({
    filter: {
      filterBy: { budgetId: budget.id, status }
    }
  })

  const { observerRef } = usePagination({ data: notes, fetchNextPage })

  if (isLoading || !notes) {
    return <NoteListSkeleton />
  }

  return (
    <>
      <Listing className="w-11/12 mx-auto px-2 flex flex-wrap items-center gap-x-12 gap-y-4"
        fallbackProps={{
          className: 'mx-auto',
          value: 'There is no recorded note to display.'
        }}
        itemProps={{ className: "w-full" }}
        pages={notes.pages}
      >
        {(note) => <Note budget={budget} note={note} />}
      </Listing>

      <div ref={observerRef}>
        {isFetchingNextPage && <NoteListSkeleton />}
      </div>
    </>
  )
}

export default NoteList
