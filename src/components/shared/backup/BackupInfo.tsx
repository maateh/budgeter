import { format } from "date-fns"

// icons
import { FileWarning, Rocket, Save } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BudgetNameBadge from "@/components/shared/budget/custom/BudgetNameBadge"
import InfoBadge from "@/components/ui/custom/InfoBadge"

// types
import { BackupFileContent } from "@/services/backup/types"

// utils
import { cn } from "@/lib/utils"

type BackupInfoProps = BackupFileContent & React.HTMLAttributes<HTMLDivElement>

const BackupInfo = ({ backup_date, complete, version, data, className, ...props }: BackupInfoProps) => {
  return (
    <div className={cn("pt-4 flex flex-col gap-y-3.5 border-primary border-t", className)}
      {...props}
    >
      {complete ? (
        <InfoBadge className="max-w-md mx-auto text-xs bg-destructive/35 hover:bg-destructive/40"
          separatorProps={{ className: "hidden" }}
          valueProps={{ className: "font-medium break-words" }}
          variant="destructive"
          icon={<FileWarning className="text-destructive" />}
          value="This backup is a complete system backup. If you restore it, you will override every current data."
        />
      ) : (
        <div className="flex flex-col items-center gap-y-2.5">
          <InfoBadge className="max-w-md mx-auto text-xs"
            separatorProps={{ className: "hidden" }}
            valueProps={{ className: "font-medium break-words" }}
            variant="destructive"
            icon={<FileWarning className="text-destructive" />}
            value="If you restore this backup, the following budgets will be overridden:"
          />

          <ul className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-2">
            {Object.values(data.budgets).map((budget) => (
              <li key={budget.id}>
                <BudgetNameBadge
                  size="sm"
                  budget={budget}
                />
              </li>
            ))}
          </ul>

          <Separator />
        </div>
      )}

      <InfoBadge className="w-fit text-sm border border-muted/30"
        separatorProps={{ className: "h-5" }}
        valueProps={{ className: "font-medium" }}
        orientation="vertical"
        variant="default"
        icon={<Save size={20} />}
        label="Backup Date"
        value={format(backup_date, 'yyyy. MM. dd. HH:mm:ss')}
      />

      <InfoBadge className="w-fit text-xs border border-muted/30"
        separatorProps={{ className: "h-3" }}
        orientation="vertical"
        variant="default"
        size="sm"
        icon={<Rocket size={18} />}
        label="Backup Version"
        value={`${version}`}
      />
    </div>
  )
}

export default BackupInfo
