import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useCreateTransaction } from "@/lib/react-query/mutations"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"

const useTransactionSubmit = (form: UseFormReturn<TransactionFieldValues>) => {
  const navigate = useNavigate()
  
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction()

  const onSubmit: SubmitHandler<TransactionFieldValues> = async (values) => {
    try {
      await createTransaction({ data: values })

      form.reset()
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTransactionSubmit
