import { useState } from "react"

// icons
import { MessageCirclePlus, Undo2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetNoteForm from "@/components/form/budget/BudgetNoteForm"
import NoteList from "@/components/shared/NoteList"

// types
import Budget from "@/models/Budget"

type BudgetNotesProps = {
  budget: Budget
}

const BudgetNotes = ({ budget }: BudgetNotesProps) => {
  const [editingMode, setEditingMode] = useState(false)

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex justify-between items-center gap-x-4">
        <h2>
          Budget <span className="overline text-blue-500">Notes</span>
        </h2>

        <Button
          className="border-md icon-wrapper"
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
          budget={budget}
          cleanForm={() => setEditingMode(false)}
          cancelAction={() => setEditingMode(false)}
        />
      )}

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-3.5">
          <h3 className="pl-2 border-l-2 border-green-800 dark:border-green-500">
            <span className="text-green-700 dark:text-green-400">Open</span> Notes
          </h3>
          <NoteList
            budget={budget}
            notes={
              Object.values(budget.notes)
                .filter(note => !note.date.closed)
                .sort((n1, n2) => n1.date.created < n2.date.created ? 1 : -1)
            }
          />
        </div>

        <div className="flex flex-col gap-y-3.5">
          <h3 className="pl-2 border-l-2 border-red-700 dark:border-red-500">
            <span className="text-red-600 dark:text-red-400">Closed</span> Notes
          </h3>
          <NoteList
            budget={budget}
            notes={
              Object.values(budget.notes)
                .filter(note => note.date.closed)
                .sort((n1, n2) => n1.date.closed! < n2.date.closed! ? 1 : -1)
            }
          />
        </div>
      </div>
    </div>
  )
}

export default BudgetNotes
