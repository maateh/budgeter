import { UseFormReturn } from "react-hook-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// types
import { FieldValues } from "@/components/form/budget/types"

type BudgetNoteFormFieldsProps = {
  form: UseFormReturn<FieldValues['note']>
  cancelAction: () => void
}

const BudgetNoteFormFields = ({ form, cancelAction }: BudgetNoteFormFieldsProps) => {
  const { control } = form

  return (
    <div className="min-w-[75%] mx-auto flex flex-col gap-1.5">
      <FormField
        control={control}
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

      <div className="my-0.5 flex gap-x-3.5 justify-end">
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
    </div>
  )
}

export default BudgetNoteFormFields
