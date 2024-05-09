import { useState } from "react"
import { useParams } from "react-router-dom"

// icons
import { MessageCirclePlus, Undo2 } from "lucide-react"

// shadcn
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2.5">
        <h2 className="border-blue-600 dark:border-blue-500 indent-border">
          Budget <span className="text-blue-600 dark:text-blue-500 overline">Notes</span>
        </h2>

        <Button className="ml-auto px-4 icon-wrapper"
          size="sm"
          onClick={() => setEditingMode((mode) => !mode)}
        >
          {editingMode ? (
            <>
              <Undo2 size={20} />
              Cancel
            </>
          ) : (
            <>
              <MessageCirclePlus size={20} />
              Add a Note
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

      <Accordion className="w-[95%] mx-auto space-y-4" type="multiple">
        <AccordionItem value="open">
          <AccordionTrigger className="bg-primary/15 px-3.5 mb-2">
            <h3 className="indent-border border-green-800 dark:border-green-500">
              <span className="text-green-700 dark:text-green-400">Open</span> Notes
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            {!isBudgetLoading && budget ? (
              <NoteList budget={budget} status="open" />
            ) : <NoteListSkeleton />}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="closed">
          <AccordionTrigger className="bg-primary/15 px-3.5 mb-2">
            <h3 className="indent-border border-red-700 dark:border-red-500">
              <span className="text-red-600 dark:text-red-400">Closed</span> Notes
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            {!isBudgetLoading && budget ? (
              <NoteList budget={budget} status="closed" />
            ) : <NoteListSkeleton />}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default BudgetNotes
