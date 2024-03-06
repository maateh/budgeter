import { UUID } from "crypto"
import { useParams } from "react-router-dom"

// components
import Form from "@/components/form/Form"
import BudgetFormFields from "@/components/form/budget/BudgetFormFields"

// hooks
import { useGetBudget } from "@/lib/react-query/queries"
import { useBudgetSubmit } from "@/components/form/budget/hooks"

// types
import { BudgetSubmitProps, BudgetFieldValues } from "@/components/form/budget/types"

// validations
import { BudgetValidation } from "@/lib/validation"

type BudgetFormProps = {
  type: "create" | "edit"
}

const BudgetForm = ({ type }: BudgetFormProps) => {
  const { id } = useParams() as { id: UUID }

  const { data: budget, /*isLoading*/ } = useGetBudget(id)
  
  return (
    <Form<BudgetFieldValues, typeof BudgetValidation, BudgetSubmitProps>
      type={type}
      validationSchema={BudgetValidation}
      defaultValues={{
        name: budget?.name || '',
        type: budget?.type || 'income',
        balance: budget?.balance || {
          currency: '',
          current: 0,
          ceiling: 0
        },
        theme: budget?.theme || {
          background: '#dedede',
          foreground: '#202020'
        }
      }}
      useSubmit={useBudgetSubmit}
      submitProps={{ budgetId: budget?.id }}
    >
      {(form) => (
        <BudgetFormFields form={form} />
      )}
    </Form>
  )
}

export default BudgetForm
