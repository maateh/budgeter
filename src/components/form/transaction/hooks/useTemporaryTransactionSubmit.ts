import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useCreateTransactionMutation } from "@/lib/react-query/mutations"

// types
import { FieldValue } from "@/components/form/transaction/types"

const useTemporaryTransactionSubmit = (form: UseFormReturn<FieldValue['temporary']>) => {
  const { mutateAsync: createTransaction, isPending } = useCreateTransactionMutation()
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValue['temporary']> = async (values) => {
    // const transaction = new Transaction(id, 'temporary', {
    //   ...values,
    //   expired: false,
    //   date: {
    //     ...parseDateValues(values),
    //     expire: values.expireDate
    //   },
    //   payment: values.payment as Transaction['payment'],
    //   status: values.status as Transaction['status']
    // })
    
    try {
      // TODO: handle saving TransferringTransaction
      await createTransaction(values)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTemporaryTransactionSubmit
