// icons
import { LucideIcon, LucideProps, MoreHorizontal } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuContentProps, DropdownMenuItem, DropdownMenuItemProps, DropdownMenuLabel, DropdownMenuLabelProps, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// utils
import { cn } from "@/lib/utils"

export type Action = {
  name: string
  Icon: LucideIcon
  iconProps?: LucideProps
  onClick: () => void
} & Omit<DropdownMenuItemProps, 'onClick'>

type DropdownActionsProps = {
  triggerProps?: ButtonProps
  label?: string
  labelProps?: DropdownMenuLabelProps
  actions: Action[]
} & Omit<DropdownMenuContentProps, 'children'> & React.PropsWithChildren

const DropdownActions = ({
  triggerProps, label = 'Actions', labelProps, actions,
  children, className, align = 'end', ...props
}: DropdownActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button {...triggerProps}
            variant={triggerProps?.variant || "ghost"}
            size={triggerProps?.size || "icon"}
          >
            <span className="sr-only">Open actions</span>
            <MoreHorizontal className="size-3.5 sm:size-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("space-y-0.5", className)} align={align} {...props}>
        <DropdownMenuLabel {...labelProps} className={cn("text-base font-heading small-caps", labelProps?.className)}>
          {label}
        </DropdownMenuLabel>

        {actions.map(({ name, Icon, iconProps, className, ...props }) => (
          <DropdownMenuItem className={cn("cursor-pointer icon-wrapper", className)}
            key={name}
            {...props}
          >
            <Icon {...iconProps} className={cn("size-3 sm:size-4", iconProps?.className)}
              strokeWidth={iconProps?.strokeWidth || 3}
            />
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownActions
