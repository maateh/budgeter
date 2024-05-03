import { useState } from "react"
import { useParams } from "react-router-dom"

// icons
import { MessageCirclePlus, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetNoteForm from "@/components/form/budget-note/BudgetNoteForm"
import NoteList from "@/components/shared/budget-note/NoteList"
import NoteListSkeleton from "@/components/shared/budget-note/NoteList.skeleton"

// hooks
import { useBudget } from "@/lib/react-query/queries"

const BudgetNotes = () => {
  const { id } = useParams() as { id: string }

  const [editingMode, setEditingMode] = useState(false)

  const { data: budget, isLoading: isBudgetLoading } = useBudget(id)

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex justify-between items-center gap-x-4">
        <h2>
          Budget <span className="overline text-blue-500">Notes</span>
        </h2>

        <Button className="border-md icon-wrapper"
          onClick={() => setEditingMode((mode) => !mode)}
        >
          {editingMode ? (
            <>
              <Undo2 size={20} />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <MessageCirclePlus size={20} />
              <span>Add a Note</span>
            </>
          )}
        </Button>
      </div>

      {editingMode && (
        <BudgetNoteForm
          type="create"
          budgetId={id}
          onSubmitted={() => setEditingMode(false)}
          onCancel={() => setEditingMode(false)}
        />
      )}

        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-3.5">
            <h3 className="pl-2 border-l-2 border-green-800 dark:border-green-500">
              <span className="text-green-700 dark:text-green-400">Open</span> Notes
            </h3>
            {!isBudgetLoading && budget ? (
              <NoteList budget={budget} status="open" />
            ) : <NoteListSkeleton />}
          </div>
  
          <div className="flex flex-col gap-y-3.5">
            <h3 className="pl-2 border-l-2 border-red-700 dark:border-red-500">
              <span className="text-red-600 dark:text-red-400">Closed</span> Notes
            </h3>
            {!isBudgetLoading && budget ? (
              <NoteList budget={budget} status="closed" />
            ) : <NoteListSkeleton />}
          </div>
        </div>
    </div>
  )
}

export default BudgetNotes
