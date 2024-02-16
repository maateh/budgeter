import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useSaveTransactionMutation } from "@/components/form/transaction/hooks"
import { useFormContext } from "@/services/providers/form/FormContext.hooks"

// models
import Transaction from "@/models/Transaction"

// types
import { FieldValue } from "@/components/form/transaction/types"

// utils
import { parseDateValues } from "@/components/form/transaction/utils"

const useTemporaryTransactionSubmit = (form: UseFormReturn<FieldValue['temporary']>) => {
  const { mutateAsync: saveTransaction, isPending } = useSaveTransactionMutation()
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValue['temporary']> = async (values) => {
    const id = crypto.randomUUID()
    const transaction = new Transaction(id, 'temporary', {
      ...values,
      expired: false,
      date: {
        ...parseDateValues(values),
        expire: values.expireDate
      },
      payment: values.payment as Transaction['payment'],
      status: values.status as Transaction['status']
    })
    
    try {
      // TODO: save TransferringTransactionForm
      await saveTransaction(transaction)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTemporaryTransactionSubmit
