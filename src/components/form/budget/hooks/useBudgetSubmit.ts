import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useSaveBudget } from "@/lib/react-query/mutations"

// types
import { BudgetSubmitProps, BudgetFieldValues } from "@/components/form/budget/types"

const useBudgetSubmit = (form: UseFormReturn<BudgetFieldValues>, { budgetId, type }: BudgetSubmitProps) => {
  const navigate = useNavigate()

  const { mutateAsync: saveBudget, isPending } = useSaveBudget(budgetId)

  const onSubmit: SubmitHandler<BudgetFieldValues> = async (values) => {
    try {
      const budget = await saveBudget({
        id: budgetId,
        data: values
      })

      form.reset()

      if (type === 'create') {
        navigate(`/budgets/${budget.id}`, { replace: true })
      }
      
      if (type === 'edit') navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetSubmit
