import { UseFormReturn } from "react-hook-form"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget-note/types"

type BudgetNoteFormFieldsProps = UseFormReturn<BudgetNoteFieldValues> & {
  isPending: boolean
  onCancel: () => void
}

const BudgetNoteFormFields = ({ control, isPending, onCancel }: BudgetNoteFormFieldsProps) => {
  return (
    <div className="min-w-[75%] mx-auto flex flex-col gap-1.5">
      <FormField
        control={control}
        name="text"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-y-1.5">
            <FormLabel className="text-md">Note Message</FormLabel>
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

      <div className="my-1 flex gap-x-3.5 justify-end">
        <Button type="button"
          variant="destructive"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className="border-md"
          size="sm"
          type="submit"
          disabled={isPending}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default BudgetNoteFormFields
