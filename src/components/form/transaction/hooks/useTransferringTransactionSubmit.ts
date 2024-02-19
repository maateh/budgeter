import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useFormContext } from "@/services/providers/form/FormContext.hooks"
import { useCreateTransactionMutation } from "@/hooks/mutations"

// models
import Transaction from "@/models/Transaction"

// types
import { FieldValue } from "@/components/form/transaction/types"

// utils
import { parseDateValues } from "@/components/form/transaction/utils"

const useTransferringTransactionSubmit = (form: UseFormReturn<FieldValue['transferring']>) => {
  const { mutateAsync: createTransaction, isPending } = useCreateTransactionMutation()
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValue['transferring']> = async (values) => {
    const id = crypto.randomUUID()
    const transaction = new Transaction(id, 'transferring', {
      ...values,
      date: parseDateValues(values),
      payment: values.payment as Transaction['payment'],
      status: values.status as Transaction['status']
    })
    
    try {
      // TODO: handle saving TransferringTransaction
      await createTransaction(transaction)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTransferringTransactionSubmit
