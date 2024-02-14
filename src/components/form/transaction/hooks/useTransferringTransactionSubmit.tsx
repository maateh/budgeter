import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
// import { useSaveTransactionMutation } from "./TransactionForm.mutations"

// models
import TransferringTransaction from "@/models/TransferringTransaction"

// types
import { FormFields } from "@/components/form/transaction/types"

// utils
import { parseDateValues } from "@/components/form/transaction/utils"

const useTransferringTransactionSubmit = (form: UseFormReturn) => {
  // const { mutateAsync: saveTransaction, isPending } = useSaveTransactionMutation()

  const onSubmit: SubmitHandler<FormFields['transferring']> = async (values) => {
    const id = crypto.randomUUID()
    const transaction = new TransferringTransaction(id, {
      ...values,
      date: parseDateValues(values),
      payment: values.payment as TransferringTransaction['payment'],
      status: values.status as TransferringTransaction['status']
    })
    
    try {
      // TODO: save TransferringTransactionForm
      // await saveTransaction(transaction)

      form.reset()
      form.setValue("budgetId", transaction.budgetId)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending: false }
}

export default useTransferringTransactionSubmit
