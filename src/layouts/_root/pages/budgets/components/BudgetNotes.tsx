import { useState } from "react"

// icons
import { MessageCirclePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// components
import NoteList from "./NoteList"

// types
import Budget from "@/models/Budget"

type BudgetNotesProps = {
  budget: Budget
}

const BudgetNotes = ({ budget }: BudgetNotesProps) => {
  const [editingMode, setEditingMode] = useState(false)

  const handleAddNote = () => {
    // TODO: add note to budget
  }

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
          <MessageCirclePlus size={20} />
          <span>Add a Note</span>
        </Button>
      </div>

      {editingMode && (
        <div className="w-3/4 mx-auto flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-x-5">
            <Label className="text-md font-heading">Note Message</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNote}
            >
              Add
            </Button>
          </div>
          <Textarea placeholder="Type your note here." />
        </div>
      )}

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-3.5">
          <h3 className="pl-2 border-l-2 border-green-800 dark:border-green-500">
            <span className="text-green-700 dark:text-green-400">Open</span> Notes
          </h3>
          <NoteList
            budget={budget}
            // notes={
            //   Object.values(budget.notes)
            //     .filter(note => !note.date.closed)
            // }
            notes={[
              {
                id: '1',
                text: `Lorem ipsum -
                dolor sit amet consectetur adipisicing elit. 
                Eveniet ipsum modi illum repudiandae officia, incidunt vel error reprehenderit aliquam molestiae voluptatibus autem nesciunt quod possimus inventore magni eos accusamus sapiente!`,
                date: {
                  created: new Date()
                }
              },
              {
                id: '2',
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ipsum modi illum repudiandae officia, incidunt vel error reprehenderit aliquam molestiae voluptatibus autem nesciunt quod possimus inventore magni eos accusamus sapiente!',
                date: {
                  created: new Date(),
                  edited: new Date()
                }
              }
            ]}
          />
        </div>

        <div className="flex flex-col gap-y-3.5">
          <h3 className="pl-2 border-l-2 border-red-700 dark:border-red-500">
            <span className="text-red-600 dark:text-red-400">Closed</span> Notes
          </h3>
          <NoteList
            budget={budget}
            // notes={
            //   Object.values(budget.notes)
            //     .filter(note => note.date.closed)
            // }
            notes={[
              {
                id: '1',
                text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ipsum modi illum repudiandae officia, incidunt vel error reprehenderit aliquam molestiae voluptatibus autem nesciunt quod possimus inventore magni eos accusamus sapiente!',
                date: {
                  created: new Date(),
                  closed: new Date()
                }
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default BudgetNotes
