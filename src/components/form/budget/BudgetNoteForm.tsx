// components
import Form from "@/components/form/Form"
import BudgetNoteFormFields from "@/components/form/budget/BudgetNoteFormFields"

// hooks
import { useBudgetNoteSubmit } from "@/components/form/budget/hooks"

// types
import { BudgetNoteSubmitProps, FieldValues } from "@/components/form/budget/types"
import Budget, { BudgetNote } from "@/models/Budget"

// validation
import { BudgetNoteValidation } from "@/lib/validation"

type BudgetNoteFormProps = {
  budget: Budget
  note?: BudgetNote
  cancelAction?: () => void
}

const BudgetNoteForm = ({ budget, note, cancelAction = () => {} }: BudgetNoteFormProps) => {
  return (
    <Form<FieldValues['note'], typeof BudgetNoteValidation, BudgetNoteSubmitProps>
      type="create"
      validationSchema={BudgetNoteValidation}
      defaultValues={{
        text: note?.text || ''
      }}
      useSubmit={useBudgetNoteSubmit}
      submitProps={{ budget, note }}
      customButtonRequired
    >
      {(form) => (
        <BudgetNoteFormFields
          form={form}
          cancelAction={cancelAction}
        />
      )}
    </Form>
  )
}

export default BudgetNoteForm
