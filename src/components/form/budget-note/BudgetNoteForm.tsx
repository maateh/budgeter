import { UUID } from "crypto"

// components
import Form from "@/components/form/Form"
import BudgetNoteFormFields from "@/components/form/budget-note/BudgetNoteFormFields"

// hooks
import { useBudgetNoteSubmit } from "@/components/form/budget-note/hooks"

// types
import { BudgetNoteSubmitProps, BudgetNoteFieldValues } from "@/components/form/budget-note/types"
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
    <Form<BudgetNoteFieldValues, typeof BudgetNoteValidation, BudgetNoteSubmitProps>
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
