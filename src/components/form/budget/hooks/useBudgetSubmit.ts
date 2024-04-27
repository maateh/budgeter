import { useNavigate } from "react-router-dom"
import { SubmitHandler, UseFormReturn } from "react-hook-form"

// hooks
import { useToast } from "@/components/ui/use-toast"
import { useSaveBudget } from "@/lib/react-query/mutations"

// types
import { BudgetSubmitProps, BudgetFieldValues } from "@/components/form/budget/types"

const useBudgetSubmit = (form: UseFormReturn<BudgetFieldValues>, { budgetId, type }: BudgetSubmitProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()

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
      
      toast({
        variant: 'accent',
        title: 'Created: Budget',
        description: `"${budget.name}" budget has been successfully created.`
      })
    } catch (err) {
      console.error(err)

      toast({
        variant: 'destructive',
        title: `Oops! Failed to create budget.`,
        description: 'Please try again.'
      })
    }
  }

  return { onSubmit, isPending }
}

export default useBudgetSubmit
