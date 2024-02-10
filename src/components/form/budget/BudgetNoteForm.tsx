import { useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// hooks
import { useAddNoteMutation } from "./BudgetNoteForm.hooks"

// types
import Budget, { BudgetNote } from "@/models/Budget"

// validation
import { BudgetNoteValidation } from "@/lib/validation"

type BudgetNoteFormProps = {
  budget: Budget
  cleanForm?: () => void
}

const BudgetNoteForm = ({ budget, cleanForm = () => {} }: BudgetNoteFormProps) => {
  const { mutateAsync: addNote } = useAddNoteMutation(budget.id)

  const form = useForm<z.infer<typeof BudgetNoteValidation>>({
    resolver: zodResolver(BudgetNoteValidation),
    defaultValues: {
      text: ''
    }
  })

  async function onSubmit(values: z.infer<typeof BudgetNoteValidation>) {
    const note: BudgetNote = {
      id: crypto.randomUUID(),
      date: {
        created: new Date()
      },
      ...values,
    }

    try {
      await addNote({ budget, note })

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
        className="w-3/4 mx-auto flex flex-col gap-1.5"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-y-1.5">
              <div className="flex justify-between items-center gap-x-5">
                <FormLabel className="text-md font-heading">Note Message</FormLabel>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                >
                  Add
                </Button>
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
      </form>
    </Form>
  )
}

export default BudgetNoteForm
