import { UseFormReturn } from "react-hook-form"

// icons
import { BookmarkPlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// components
import TransactionsSelector from "@/components/input/TransactionsSelector"

// types
import { RelatedTransactionsFieldValues } from "@/components/form/related-transactions/types"
import { Transaction } from "@/services/api/types"

type RelatedTransactionsFormFieldsProps = {
  transaction: Transaction
} & UseFormReturn<RelatedTransactionsFieldValues>

const RelatedTransactionsFormFields = ({ transaction, control }: RelatedTransactionsFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="relatedId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select transactions</FormLabel>
            <FormControl>
              <TransactionsSelector
                value={field.value}
                onChange={field.onChange}
                excludeBy={{ id: [transaction.id, ...transaction.related] }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button className="w-fit px-3 -mt-2.5 ml-auto icon-wrapper"
        type="submit"
        size="sm"
      >
        <BookmarkPlus size={18} />
        <span>Add as related</span>
      </Button>
    </>
  )
}

export default RelatedTransactionsFormFields
