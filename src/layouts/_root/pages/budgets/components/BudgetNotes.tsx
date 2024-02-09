// types
import Budget from "@/models/Budget"

// components
import NoteList from "./NoteList"

type BudgetNotesProps = {
  budget: Budget
}

const BudgetNotes = ({ budget }: BudgetNotesProps) => {
  return (
    <>
      <h2 className="mb-5">
        Budget <span className="overline text-blue-500">Notes</span>
      </h2>

      <div className="flex flex-col gap-y-10">
        <div>
          <h3 className="pl-2 border-l-2 border-green-800 dark:border-green-500">
            <span className="text-green-700 dark:text-green-400">Open</span> Notes
          </h3>
          <NoteList
            notes={
              Object.values(budget.notes)
                .filter(note => !note.date.closed)
            }
          />
        </div>

        <div>
          <h3 className="pl-2 border-l-2 border-red-700 dark:border-red-500">
            <span className="text-red-600 dark:text-red-400">Closed</span> Notes
          </h3>
          <NoteList
            notes={
              Object.values(budget.notes)
                .filter(note => note.date.closed)
            }
          />
        </div>
      </div>
    </>
  )
}

export default BudgetNotes
