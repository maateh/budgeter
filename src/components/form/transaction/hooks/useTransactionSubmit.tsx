import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useSaveTransactionMutation } from "@/components/form/transaction/TransactionForm.mutations"
import { useFormContext } from "@/services/providers/form/FormContext.hooks"

// models
import Transaction from "@/models/Transaction"

// types
import { FieldValue } from "@/components/form/transaction/types"

// utils
import { parseDateValues } from "@/components/form/transaction/utils"

const useTransactionSubmit = (form: UseFormReturn<FieldValue['default']>) => {
  const { mutateAsync: saveTransaction, isPending } = useSaveTransactionMutation()
  const { cleanForm } = useFormContext()

  const onSubmit: SubmitHandler<FieldValue['default']> = async (values) => {
    const id = crypto.randomUUID()
    const transaction = new Transaction(id, {
      ...values,
      date: parseDateValues(values),
      payment: values.payment as Transaction['payment'],
      status: values.status as Transaction['status']
    })

    try {
      await saveTransaction(transaction)

      form.reset()
      cleanForm()
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useTransactionSubmit
