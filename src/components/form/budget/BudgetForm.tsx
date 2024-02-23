// components
import Form from "@/components/form/Form"
import BudgetFormFields from "@/components/form/budget/BudgetFormFields"

// hooks
import { useBudgetSubmit } from "@/components/form/budget/hooks"

// types
import { BudgetSubmitProps, FieldValues } from "@/components/form/budget/types"
import { Budget } from "@/services/api/types"

// validations
import { BudgetValidation } from "@/lib/validation"

type BudgetFormProps = {
  type: "create" | "edit"
  budget?: Budget
}

const BudgetForm = ({ type, budget }: BudgetFormProps) => {
  return (
    <Form<FieldValues['budget'], typeof BudgetValidation, BudgetSubmitProps>
      type={type}
      validationSchema={BudgetValidation}
      defaultValues={{
        name: budget?.name || '',
        type: budget?.type || 'income',
        balance: budget?.balance || {
          current: 0,
          ceiling: 0
        },
        currency: budget?.currency || '',
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
