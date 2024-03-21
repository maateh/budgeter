// components
import Form from "@/components/form/Form"
import RestoreBackupFormFields from "@/components/form/backup/RestoreBackupFormFields"

// hooks
import { useRestoreBackupSubmit } from "@/components/form/backup/hooks"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

// validation
import { backupFileSchema } from "@/components/form/backup/validations"

const RestoreBackupForm = () => {
  return (
    <Form<RestoreBackupFieldValues, typeof backupFileSchema>
      type="create"
      validationSchema={backupFileSchema}
      useSubmit={useRestoreBackupSubmit}
      customButtonRequired
    >
      {(form) => <RestoreBackupFormFields form={form} />}
    </Form>
  )
}

export default RestoreBackupForm
