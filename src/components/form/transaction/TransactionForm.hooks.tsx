import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// hooks
import { useSaveTransactionMutation } from "./TransactionForm.mutations"

// models
import Transaction from "@/models/Transaction"
import TransferringTransaction from "@/models/TransferringTransaction"
import TemporaryTransaction from "@/models/TemporaryTransaction"

// types
import { FormFields } from "@/components/form/transaction/types"

// validations
import { TransactionValidation, TransferringTransactionValidation, TemporaryTransactionValidation } from "@/lib/validation"

const defaultValues = {
  label: '',
  payment: {
    type: '+',
    amount: 0
  },
  status: 'processed'
}

function parseDateValues(values: FormFields['default' | 'transferring' | 'temporary']) {
  const currentDate = new Date()
  const date: Transaction['date'] = {
    created: currentDate,
    expected: currentDate,
    credited: currentDate
  }

  if (values.status === 'processing') {
    date.credited = undefined
    date.expected = values.expectedDate!
  }

  return date
}

export const useTransactionForm = (budgetId?: string) => {
  const { mutateAsync: saveTransaction } = useSaveTransactionMutation()

  const form = useForm<FormFields['default']>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      ...defaultValues,
      budgetId
    }
  })

  const onSubmit: SubmitHandler<FormFields['default']> = async (values) => {
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
      form.setValue("budgetId", transaction.budgetId)
    } catch (err) {
      console.error(err)
    }
  }

  return { form, onSubmit }
}

export const useTransferringTransactionForm = (budgetId?: string) => {
  // const { mutateAsync: saveTransaction } = useSaveTransactionMutation()

  const form = useForm<FormFields['transferring']>({
    resolver: zodResolver(TransferringTransactionValidation),
    defaultValues: {
      budgetId,
      label: '',
      payment: {
        type: '+',
        amount: 0
      },
      status: 'processed'
    }
  })

  const onSubmit: SubmitHandler<FormFields['transferring']> = async (values) => {
    const id = crypto.randomUUID()
    const transaction = new TransferringTransaction(id, {
      ...values,
      date: parseDateValues(values),
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

  return { form, onSubmit }
}

export const useTemporaryTransactionForm = (budgetId?: string) => {
  // const { mutateAsync: saveTransaction } = useSaveTransactionMutation()

  const form = useForm<FormFields['temporary']>({
    resolver: zodResolver(TemporaryTransactionValidation),
    defaultValues: {
      budgetId,
      label: '',
      payment: {
        type: '+',
        amount: 0
      },
      status: 'processed'
    }
  })

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

  return { form, onSubmit }
}
