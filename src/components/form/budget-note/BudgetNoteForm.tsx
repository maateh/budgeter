
// components
import Form from "@/components/form/Form"
import BudgetNoteFormFields from "@/components/form/budget-note/BudgetNoteFormFields"

// hooks
import { useBudgetNoteSubmit } from "@/components/form/budget-note/hooks"

// types
import { BudgetNoteSubmitProps, BudgetNoteFieldValues } from "@/components/form/budget-note/types"
import { BudgetNote } from "@/services/api/types"

// validation
import { budgetNoteSchema } from "@/components/form/budget-note/validations"

type BudgetNoteFormProps = {
  budgetId: string
  onSubmitted: () => void
  onCancel: () => void
} & ({
  type: 'create'
  note?: never
} | {
  type: 'edit'
  note: BudgetNote
})

const BudgetNoteForm = ({ type, budgetId, note, onSubmitted, onCancel }: BudgetNoteFormProps) => {
  return (
    <Form<BudgetNoteFieldValues, typeof budgetNoteSchema, BudgetNoteSubmitProps>
      type={type}
      validationSchema={budgetNoteSchema}
      defaultValues={{
        text: note?.text || ''
      }}
      useSubmit={useBudgetNoteSubmit}
      submitProps={{
        budgetId,
        noteId: note?.id,
        onSubmitted
      }}
      customButtonRequired
    >
      {(form) => (
        <BudgetNoteFormFields onCancel={onCancel} {...form} />
      )}
    </Form>
  )
}

export default BudgetNoteForm
