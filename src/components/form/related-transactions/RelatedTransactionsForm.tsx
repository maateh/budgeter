// components
import Form from "@/components/form/Form"
import RelatedTransactionsFormFields from "@/components/form/related-transactions/RelatedTransactionsFormFields"

// hooks
import { useRelatedTransactionsSubmit } from "@/components/form/related-transactions/hooks"

// types
import { RelatedTransactionsFieldValues } from "@/components/form/related-transactions/types"
import { Transaction } from "@/services/api/types"

// validations
import { relatedTransactionsFormSchema } from "@/lib/validations"

type RelatedTransactionsFormProps = {
  transaction: Transaction
}

const RelatedTransactionsForm = ({ transaction }: RelatedTransactionsFormProps) => {
  return (
    <Form<RelatedTransactionsFieldValues, typeof relatedTransactionsFormSchema>
      type="create"
      validationSchema={relatedTransactionsFormSchema}
      useSubmit={useRelatedTransactionsSubmit}
      customButtonRequired
    >
      {(form) => (
        <RelatedTransactionsFormFields
          transaction={transaction}
          {...form}
        />
      )}
    </Form>
  )
}

export default RelatedTransactionsForm
