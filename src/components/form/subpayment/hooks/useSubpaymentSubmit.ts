import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useAddSubpayment } from "@/lib/react-query/mutations"

// types
import { SubpaymentFieldValues, SubpaymentSubmitProps } from "@/components/form/subpayment/types"

const useSubpaymentSubmit = (form: UseFormReturn<SubpaymentFieldValues>, { transactionId }: SubpaymentSubmitProps) => {
  const { mutateAsync: createSubpayment, isPending } = useAddSubpayment(transactionId)

  const onSubmit: SubmitHandler<SubpaymentFieldValues> = async (values) => {
    try {
      await createSubpayment({
        id: transactionId,
        data: values
      })

      form.reset()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useSubpaymentSubmit
