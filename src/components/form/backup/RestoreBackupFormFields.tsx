import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { AlertTriangle, ArchiveRestore } from "lucide-react"

// shadcn
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// components
import FileInput from "@/components/input/FileInput"
import BackupFileInfo from "@/components/shared/backup/BackupInfo"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"

type RestoreBackupFormFieldsProps = UseFormReturn<RestoreBackupFieldValues> & {
  isPending: boolean
}

const RestoreBackupFormFields = ({ control, isPending }: RestoreBackupFormFieldsProps) => {
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

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-fit ml-auto icon-wrapper"
            type="button"
            disabled={!content}
          >
            <ArchiveRestore strokeWidth={2.5} />
            Restore
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent variant="negative">
          <AlertDialogHeader className="text-lg font-heading font-semibold">
            Do you want to restore the backup?
          </AlertDialogHeader>

          <AlertDialogDescription className="icon-wrapper">
            <AlertTriangle className="text-destructive" size={20} />
            <span>This action cannot be undone.</span>
          </AlertDialogDescription>

          {content && <BackupFileInfo {...content} />}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="icon-wrapper"
              type="submit"
              disabled={isPending}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default RestoreBackupFormFields
