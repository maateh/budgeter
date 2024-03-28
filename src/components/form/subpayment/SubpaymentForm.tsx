// components
import Form from "@/components/form/Form"
import SubpaymentFormFields from "@/components/form/subpayment/SubpaymentFormFields"

// hooks
import { useSubpaymentSubmit } from "@/components/form/subpayment/hooks"

// types
import { SubpaymentFieldValues, SubpaymentSubmitProps } from "@/components/form/subpayment/types"

// validations
import { paymentFormSchema } from "@/lib/validations"

type SubpaymentFormProps = {
  transactionId: string
}

const SubpaymentForm = ({ transactionId }: SubpaymentFormProps) => {
  return (
    <Form<SubpaymentFieldValues, typeof paymentFormSchema, SubpaymentSubmitProps>
      type="create"
      validationSchema={paymentFormSchema}
      defaultValues={{
        type: '+',
        amount: 0
      }}
      useSubmit={useSubpaymentSubmit}
      submitProps={{ transactionId }}
      customButtonRequired
    >
      {(form) => <SubpaymentFormFields {...form} />}
    </Form>
  )
}

export default SubpaymentForm
