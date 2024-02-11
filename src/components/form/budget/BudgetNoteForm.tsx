import { useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// hooks
import { useSaveNoteMutation } from "./BudgetNoteForm.hooks"

// types
import Budget, { BudgetNote } from "@/models/Budget"

// validation
import { BudgetNoteValidation } from "@/lib/validation"

type BudgetNoteFormProps = {
  budget: Budget
  note?: BudgetNote
  cleanForm?: () => void
  cancelAction?: () => void
}

const BudgetNoteForm = ({ budget, note, cleanForm = () => {}, cancelAction = () => {} }: BudgetNoteFormProps) => {
  const { mutateAsync: saveNote } = useSaveNoteMutation(budget.id)

  const form = useForm<z.infer<typeof BudgetNoteValidation>>({
    resolver: zodResolver(BudgetNoteValidation),
    defaultValues: {
      text: note?.text || ''
    }
  })

  async function onSubmit(values: z.infer<typeof BudgetNoteValidation>) {
    note = {
      id: note?.id || crypto.randomUUID(),
      date: {
        created: note?.date.created || new Date(),
        edited: note ? new Date() : undefined,
        ...note?.date
      },
      ...values,
    }

    try {
      await saveNote({ budget, note })

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-[75%] mx-auto flex flex-col gap-1.5"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-y-1.5">
              <div className="flex justify-between items-center gap-x-5">
                <FormLabel className="text-md font-heading">Note Message</FormLabel>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Type your note here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="my-0.5 flex gap-x-2 justify-end">
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={cancelAction}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="border-md"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default BudgetNoteForm
