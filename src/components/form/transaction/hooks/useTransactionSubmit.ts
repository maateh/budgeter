import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useCreateTransactionMutation } from "@/lib/react-query/mutations"

// types
import { FieldValue } from "@/components/form/transaction/types"

const useTransactionSubmit = (form: UseFormReturn<FieldValue['default']>) => {
  const { mutateAsync: createTransaction, isPending } = useCreateTransactionMutation()
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValue['default']> = async (values) => {
    try {
      await createTransaction(values)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTransactionSubmit
