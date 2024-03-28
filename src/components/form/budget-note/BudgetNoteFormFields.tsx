import { UseFormReturn } from "react-hook-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget-note/types"

type BudgetNoteFormFieldsProps = UseFormReturn<BudgetNoteFieldValues> & {
  onCancel: () => void
}

const BudgetNoteFormFields = ({ control, onCancel }: BudgetNoteFormFieldsProps) => {
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
          size="sm"
          variant="destructive"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit"
          size="sm"
          className="border-md"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default BudgetNoteFormFields
