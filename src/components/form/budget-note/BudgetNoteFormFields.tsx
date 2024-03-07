import { UseFormReturn } from "react-hook-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"

// types
import { BudgetNoteFieldValues } from "@/components/form/budget-note/types"

type BudgetNoteFormFieldsProps = {
  form: UseFormReturn<BudgetNoteFieldValues>
}

const BudgetNoteFormFields = ({ form }: BudgetNoteFormFieldsProps) => {
  const { control } = form
  
  const { cancelAction } = useFormContext()

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
          onClick={cancelAction}
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
