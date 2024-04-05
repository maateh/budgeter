// components
import Form from "@/components/form/Form"
import RestoreBackupFormFields from "@/components/form/backup/RestoreBackupFormFields"

// hooks
import { useRestoreBackupSubmit } from "@/components/form/backup/hooks"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

// validation
import { backupSchema } from "@/lib/validations"

const RestoreBackupForm = () => {
  return (
    <Form<RestoreBackupFieldValues, typeof backupSchema>
      type="create"
      validationSchema={backupSchema}
      useSubmit={useRestoreBackupSubmit}
      customButtonRequired
    >
      {(form) => <RestoreBackupFormFields {...form} />}
    </Form>
  )
}

export default RestoreBackupForm
