import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useAddRelatedTransactions } from "@/lib/react-query/mutations"

// types
import { RelatedTransactionsFieldValues, RelatedTransactionsSubmitProps } from "@/components/form/related-transactions/types"

const useRelatedTransactionsSubmit = (
  form: UseFormReturn<RelatedTransactionsFieldValues>,
  { transactionId }: RelatedTransactionsSubmitProps
) => {
  const { mutateAsync: addRelated, isPending } = useAddRelatedTransactions(transactionId)

  const onSubmit: SubmitHandler<RelatedTransactionsFieldValues> = async (values) => {
    try {
      await addRelated({
        id: transactionId,
        data: values
      })

      form.setValue('relatedId', '')
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useRelatedTransactionsSubmit
