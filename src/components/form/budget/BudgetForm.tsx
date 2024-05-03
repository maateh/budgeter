// components
import Form from "@/components/form/Form"
import BudgetFormFields from "@/components/form/budget/BudgetFormFields"

// hooks
import { useBudget } from "@/lib/react-query/queries"
import { useBudgetSubmit } from "@/components/form/budget/hooks"

// types
import { BudgetSubmitProps, BudgetFieldValues } from "@/components/form/budget/types"

// validations
import { budgetFormSchema } from "@/lib/validations"

type BudgetFormProps = {
  id?: string
}

const BudgetForm = ({ id }: BudgetFormProps) => {
  const { data: budget, isLoading } = useBudget(id || '', { enabled: !!id })
  
  return (
    <Form<BudgetFieldValues, typeof budgetFormSchema, BudgetSubmitProps>
      type={id ? 'edit' : 'create'}
      validationSchema={budgetFormSchema}
      defaultValues={{
        name: budget?.name || '',
        balance: budget?.balance || {
          currency: '',
          current: 0
        },
        theme: budget?.theme || '#e58e58'
      }}
      useSubmit={useBudgetSubmit}
      submitProps={{ budgetId: budget?.id, type: id ? 'edit' : 'create' }}
    >
      {(form) => (
        <BudgetFormFields {...form} disabled={!!id && isLoading} />
      )}
    </Form>
  )
}

export default BudgetForm
