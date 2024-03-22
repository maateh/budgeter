import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { ArchiveRestore } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// components
import FileInput from "@/components/input/FileInput"
import BackupFileInfo from "@/components/shared/backup/BackupInfo"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

type RestoreBackupFormFieldsProps = {
  form: UseFormReturn<RestoreBackupFieldValues>
}

const RestoreBackupFormFields = ({ form }: RestoreBackupFormFieldsProps) => {
  const { control } = form

  const content = useWatch({
    control,
    name: 'fileContent'
  })

  return (
    <>
      <FormField
        control={control}
        name="fileContent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select a Backup File</FormLabel>
            <FormControl>
              <FileInput
                setFileContent={(value) => {
                  field.onChange(JSON.parse(value as string))
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {content && <BackupFileInfo {...content} />}

      <Button className="w-fit ml-auto icon-wrapper">
        <ArchiveRestore strokeWidth={2.5} />
        Restore
      </Button>
    </>
  )
}

export default RestoreBackupFormFields
