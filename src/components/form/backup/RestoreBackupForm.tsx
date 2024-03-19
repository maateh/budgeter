// icons
import { ArchiveRestore } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// components
import Form from "@/components/form/Form"
import FileInput from "@/components/input/FileInput"

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
      defaultValues={{}} // TODO: make it optional
      useSubmit={useRestoreBackupSubmit}
      customButtonRequired
    >
      {({ control }) => (
        <>
          <FormField
            control={control}
            name="fileContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Backup File</FormLabel>
                <FormControl>
                  <FileInput setFileContent={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-fit mx-auto icon-wrapper">
            <ArchiveRestore strokeWidth={2.5} />
            Restore
          </Button>
        </>
      )}
    </Form>
  )
}

export default RestoreBackupForm
