import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useCreateTransaction } from "@/lib/react-query/mutations"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"

const useTransactionSubmit = (form: UseFormReturn<TransactionFieldValues>) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction()

  const onSubmit: SubmitHandler<TransactionFieldValues> = async (values) => {
    try {
      await createTransaction(values)

      form.reset()
      navigate(-1)

      toast({
        variant: 'accent',
        title: 'Created: Transaction',
        description: `"${values.name}" transaction has been successfully created.`
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: `Oops! Failed to create transaction.`,
        description: 'Please try again.'
      })
    }
  }

  return { onSubmit, isPending }
}

export default useTransactionSubmit
