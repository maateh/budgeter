// components
import Form from "@/components/form/Form"
import SubpaymentFormFields from "@/components/form/subpayment/SubpaymentFormFields"

// hooks
import { useSubpaymentSubmit } from "@/components/form/subpayment/hooks"

// types
import { SubpaymentFieldValues, SubpaymentSubmitProps } from "@/components/form/subpayment/types"

// validations
import { subpaymentFormSchema } from "@/lib/validations"

type SubpaymentFormProps = {
  transactionId: string
  budgetId: string
}

const SubpaymentForm = ({ budgetId, transactionId }: SubpaymentFormProps) => {
  return (
    <Form<SubpaymentFieldValues, typeof subpaymentFormSchema, SubpaymentSubmitProps>
      type="create"
      validationSchema={subpaymentFormSchema}
      defaultValues={{
        budgetId,
        type: '+',
        amount: 0
      }}
      useSubmit={useSubpaymentSubmit}
      submitProps={{ transactionId }}
      customButtonRequired
    >
      {(form, isPending) => <SubpaymentFormFields {...form} isPending={isPending}/>}
    </Form>
  )
}

export default SubpaymentForm
