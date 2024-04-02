import { SubmitHandler } from "react-hook-form"

// types
import { RelatedTransactionsFieldValues } from "@/components/form/related-transactions/types"

const useRelatedTransactionsSubmit = () => {
  // TODO: implement mutation

  const onSubmit: SubmitHandler<RelatedTransactionsFieldValues> = (values) => {
    try {
      // TODO: mutate
      // await addRelated(values)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending: false }
}

export default useRelatedTransactionsSubmit
