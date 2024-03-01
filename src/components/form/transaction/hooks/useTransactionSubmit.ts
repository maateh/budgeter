import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useCreateTransaction } from "@/lib/react-query/mutations"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"

const useTransactionSubmit = (form: UseFormReturn<TransactionFieldValues>) => {
  const { cleanForm } = useFormContext()
  
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction()

  const onSubmit: SubmitHandler<TransactionFieldValues> = async (values) => {
    try {
      await createTransaction({ data: values })

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTransactionSubmit
