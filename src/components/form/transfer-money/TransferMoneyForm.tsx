// components
import Form from "@/components/form/Form"
import TransferMoneyFormFields from "@/components/form/transfer-money/TransferMoneyFormFields"

// hooks
import { useTransferMoneySubmit } from "@/components/form/transfer-money/hooks"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"

// validations
import { transferMoneySchema } from "@/components/form/transfer-money/validations"

type TransferMoneyFormProps = {
  budgetId: string
}

const TransferMoneyForm = ({ budgetId }: TransferMoneyFormProps) => {
  return (
    <Form<TransferMoneyFieldValues, typeof transferMoneySchema>
      type="create"
      validationSchema={transferMoneySchema}
      defaultValues={{
        budgetId,
        processed: true,
        type: 'transfer',
        name: '',
        payment: {
          amount: 0,
          type: '+'
        }
      }}
      useSubmit={useTransferMoneySubmit}
      customButtonRequired
    >
      {(form) => <TransferMoneyFormFields budgetId={budgetId} {...form} />}
    </Form>
  )
}

export default TransferMoneyForm
