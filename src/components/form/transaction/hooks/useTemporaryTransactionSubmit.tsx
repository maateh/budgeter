import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
// import { useSaveTransactionMutation } from "./TransactionForm.mutations"

// models
import Transaction from "@/models/Transaction"
import TemporaryTransaction from "@/models/TemporaryTransaction"

// types
import { FormFields } from "@/components/form/transaction/types"

// utils
import { parseDateValues } from "@/components/form/transaction/utils"

const useTemporaryTransactionSubmit = (form: UseFormReturn) => {
  // const { mutateAsync: saveTransaction } = useSaveTransactionMutation()

  const onSubmit: SubmitHandler<FormFields['temporary']> = async (values) => {
    const id = crypto.randomUUID()
    const transaction = new TemporaryTransaction(id, {
      ...values,
      date: {
        ...parseDateValues(values),
        expire: values.expireDate
      },
      payment: values.payment as Transaction['payment'],
      status: values.status as Transaction['status']
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

export default useTemporaryTransactionSubmit
