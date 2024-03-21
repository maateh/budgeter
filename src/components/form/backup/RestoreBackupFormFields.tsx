import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { ArchiveRestore, FileWarning, Rocket, Save } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// components
import FileInput from "@/components/input/FileInput"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { RestoreBackupFieldValues } from "@/components/form/backup/types"
import { format } from "date-fns"

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

      {content && (
        <div className="pt-4 flex flex-col gap-y-3.5 border-primary border-t ">
          {content.complete && (
            <InfoBadge className="max-w-md mx-auto text-xs border border-primary bg-destructive/85 hover:bg-destructive/90"
              valueProps={{ className: "font-medium break-words" }}
              variant="destructive"
              icon={<FileWarning />}
              value="This backup is a complete system backup. If you restore it you will override every current data."
            />
          )}

          <InfoBadge className="w-fit text-sm border border-muted/30"
            separatorProps={{ className: "h-5" }}
            valueProps={{ className: "font-medium" }}
            orientation="vertical"
            variant="default"
            icon={<Save size={20} />}
            label="Backup Date"
            value={format(content.backup_date, 'yyyy. MM. dd. HH:mm:ss')}
          />

          <InfoBadge className="w-fit text-xs border border-muted/30"
            separatorProps={{ className: "h-3" }}
            orientation="vertical"
            variant="default"
            size="sm"
            icon={<Rocket size={18} />}
            label="Backup Version"
            value={`${content.version}`}
          />
        </div>
      )}

      <Button className="w-fit ml-auto icon-wrapper">
        <ArchiveRestore strokeWidth={2.5} />
        Restore
      </Button>
    </>
  )
}

export default RestoreBackupFormFields
