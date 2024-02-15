import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
// import { useSaveTransactionMutation } from "./TransactionForm.mutations"

// models
import Transaction from "@/models/Transaction"
import TemporaryTransaction from "@/models/TemporaryTransaction"

// types
import { FieldValue } from "@/components/form/transaction/types"

// utils
import { parseDateValues } from "@/components/form/transaction/utils"

const useTemporaryTransactionSubmit = (form: UseFormReturn<FieldValue['temporary']>) => {
  // const { mutateAsync: saveTransaction } = useSaveTransactionMutation()

  const onSubmit: SubmitHandler<FieldValue['temporary']> = async (values) => {
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
