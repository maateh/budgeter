// components
import Form from "@/components/form/Form"
import TransferMoneyFormFields from "@/components/form/transfer-money/TransferMoneyFormFields"

// hooks
import { useTransferMoneySubmit } from "@/components/form/transfer-money/hooks"

// types
import { TransferMoneyFieldValues, TransferMoneySubmitProps } from "@/components/form/transfer-money/types"

// validations
import { transferMoneyFormSchema } from "@/lib/validations"

type TransferMoneyFormProps = {
  budgetId: string
}

const TransferMoneyForm = ({ budgetId }: TransferMoneyFormProps) => {
  return (
    <Form<TransferMoneyFieldValues, typeof transferMoneyFormSchema, TransferMoneySubmitProps>
      type="create"
      validationSchema={transferMoneyFormSchema}
      defaultValues={{
        budgetId,
        type: 'transfer',
        name: '',
        payment: {
          amount: 0,
          type: '+',
          processed: true
        },
        customExchangeRate: 0
      }}
      useSubmit={useTransferMoneySubmit}
      submitProps={{ budgetId }}
      customButtonRequired
    >
      {(form, isPending) => (
        <TransferMoneyFormFields {...form}
          isPending={isPending}
          budgetId={budgetId}
        />
      )}
    </Form>
  )
}

export default TransferMoneyForm
