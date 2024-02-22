import { UUID } from "crypto"

// components
import Form from "@/components/form/Form"
import BudgetNoteFormFields from "@/components/form/budget/BudgetNoteFormFields"

// hooks
import { useBudgetNoteSubmit } from "@/components/form/budget/hooks"

// types
import { BudgetNoteSubmitProps, FieldValues } from "@/components/form/budget/types"
import { BudgetNote } from "@/services/api/types"

// validation
import { BudgetNoteValidation } from "@/lib/validation"

type BudgetNoteFormProps = {
  budgetId: UUID
  note?: BudgetNote
  cancelAction?: () => void
}

const BudgetNoteForm = ({ budgetId, note, cancelAction = () => {} }: BudgetNoteFormProps) => {
  return (
    <Form<FieldValues['note'], typeof BudgetNoteValidation, BudgetNoteSubmitProps>
      type="create"
      validationSchema={BudgetNoteValidation}
      defaultValues={{
        text: note?.text || ''
      }}
      useSubmit={useBudgetNoteSubmit}
      submitProps={{ budgetId, noteId: note?.id }}
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
