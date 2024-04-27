import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useBudget } from "@/lib/react-query/queries"
import { useTransferMoney } from "@/lib/react-query/mutations"

// types
import { TransferMoneyFieldValues, TransferMoneySubmitProps } from "@/components/form/transfer-money/types"

// utils
import { formatWithCurrency } from "@/utils"

const useTransferMoneySubmit = (form: UseFormReturn<TransferMoneyFieldValues>, { budgetId }: TransferMoneySubmitProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: budget } = useBudget(budgetId)
  const { mutateAsync: transferMoney, isPending } = useTransferMoney()

  const onSubmit: SubmitHandler<TransferMoneyFieldValues> = async (values) => {
    try {
      await transferMoney(values)

      form.reset()
      navigate(-1)

      toast({
        variant: 'accent',
        title: budget ? `Transferred: ${formatWithCurrency(
          values.payment.amount,
          budget.balance.currency
        )}` : '',
        description: 'Money has been successfully transferred between the selected budgets.'
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: `Oops! Failed to transfer money.`,
        description: 'Please try again.'
      })
    }
  }

  return { onSubmit, isPending }
}

export default useTransferMoneySubmit
