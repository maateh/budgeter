import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useAddRelatedTransactions } from "@/lib/react-query/mutations"

// types
import { RelatedTransactionsFieldValues, RelatedTransactionsSubmitProps } from "@/components/form/related-transactions/types"

const useRelatedTransactionsSubmit = (
  form: UseFormReturn<RelatedTransactionsFieldValues>,
  { transactionId }: RelatedTransactionsSubmitProps
) => {
  const { toast } = useToast()

  const { mutateAsync: addRelated, isPending } = useAddRelatedTransactions(transactionId)

  const onSubmit: SubmitHandler<RelatedTransactionsFieldValues> = async (values) => {
    try {
      await addRelated({
        id: transactionId,
        data: values
      })

      form.reset()

      toast({
        title: 'Added: Transactions as related',
        description: 'The selected transactions have been successfully added as related to the selected transaction.'
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: `Oops! Failed to add transactions as related.`,
        description: 'Please try again.'
      })
    }
  }

  return { onSubmit, isPending }
}

export default useRelatedTransactionsSubmit
