// components
import Form from "@/components/form/Form"
import RelatedTransactionsFormFields from "@/components/form/related-transactions/RelatedTransactionsFormFields"

// hooks
import { useRelatedTransactionsSubmit } from "@/components/form/related-transactions/hooks"

// types
import { RelatedTransactionsFieldValues, RelatedTransactionsSubmitProps } from "@/components/form/related-transactions/types"
import { Transaction } from "@/services/api/types"

// validations
import { relatedTransactionsFormSchema } from "@/lib/validations"

type RelatedTransactionsFormProps = {
  transaction: Transaction
}

const RelatedTransactionsForm = ({ transaction }: RelatedTransactionsFormProps) => {
  return (
    <Form<RelatedTransactionsFieldValues, typeof relatedTransactionsFormSchema, RelatedTransactionsSubmitProps>
      type="create"
      validationSchema={relatedTransactionsFormSchema}
      defaultValues={{ relatedIds: [] }}
      useSubmit={useRelatedTransactionsSubmit}
      submitProps={{ transactionId: transaction.id }}
      customButtonRequired
    >
      {(form, isPending) => (
        <RelatedTransactionsFormFields {...form}
          isPending={isPending}
          transaction={transaction}
        />
      )}
    </Form>
  )
}

export default RelatedTransactionsForm
