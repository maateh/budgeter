// components
import Form from "@/components/form/Form"
import BudgetFormFields from "@/components/form/budget/BudgetFormFields"

// hooks
import { useBudget } from "@/lib/react-query/queries"
import { useBudgetSubmit } from "@/components/form/budget/hooks"

// types
import { BudgetSubmitProps, BudgetFieldValues } from "@/components/form/budget/types"

// validations
import { budgetSchema } from "@/components/form/budget/validations"

type BudgetFormProps = {
  id?: string
}

const BudgetForm = ({ id }: BudgetFormProps) => {
  const { data: budget, isLoading } = useBudget(id)
  
  return (
    <Form<BudgetFieldValues, typeof budgetSchema, BudgetSubmitProps>
      type={id ? 'edit' : 'create'}
      validationSchema={budgetSchema}
      defaultValues={{
        name: budget?.name || '',
        type: budget?.type || 'income',
        balance: budget?.balance || {
          currency: '',
          current: 0,
          ceiling: 0
        },
        theme: budget?.theme || '#e58e58'
      }}
      useSubmit={useBudgetSubmit}
      submitProps={{ budgetId: budget?.id, type: id ? 'edit' : 'create' }}
    >
      {(form) => (
        <BudgetFormFields form={form} disabled={!!id && isLoading} />
      )}
    </Form>
  )
}

export default BudgetForm
