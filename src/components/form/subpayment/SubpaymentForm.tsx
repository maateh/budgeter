// components
import Form from "@/components/form/Form"
import SubpaymentFormFields from "@/components/form/subpayment/SubpaymentFormFields"

// hooks
import { useSubpaymentSubmit } from "@/components/form/subpayment/hooks"

// types
import { SubpaymentFieldValues } from "@/components/form/subpayment/types"

// validations
import { paymentSchema } from "@/components/form/subpayment/validations"

const SubpaymentForm = () => {
  return (
    <Form<SubpaymentFieldValues, typeof paymentSchema>
      type="create"
      validationSchema={paymentSchema}
      defaultValues={{
        type: '+',
        amount: 0
      }}
      useSubmit={useSubpaymentSubmit}
      customButtonRequired
    >
      {(form) => <SubpaymentFormFields {...form} />}
    </Form>
  )
}

export default SubpaymentForm
