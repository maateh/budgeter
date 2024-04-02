import { forwardRef } from "react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// utils
import { cn } from "@/lib/utils"

export type ToggleStatus = 'on' | 'off'

type StateToggleProps = {
  status: 'on' | 'off'
  icon: { [key in ToggleStatus]: React.ReactNode }
  tooltip?: { [key in ToggleStatus]: string }
  toggleOnHover?: boolean
} & ButtonProps

const StateToggle = forwardRef<HTMLButtonElement, StateToggleProps>(({
  status, icon, tooltip, toggleOnHover, className, variant = "ghost", size = "icon", ...props
}, ref) => {
  const toggleElement = (
    <Button className={cn("toggle hover:bg-foreground/5", toggleOnHover && "hover-toggle-mode", className)}
      variant={variant}
      size={size}
      ref={ref}
      {...props}
    >
      <span className={cn(status === 'on' && 'active')}>
        {toggleOnHover
          ? icon[status === 'on'
              ? Object.keys(icon)[0] as ToggleStatus
              : Object.keys(icon)[1] as ToggleStatus
            ]
          : icon[status]
        }
      </span>
      <span className={cn(status === 'off' && 'active')}>
        {toggleOnHover
          ? icon[status === 'on'
              ? Object.keys(icon)[1] as ToggleStatus
              : Object.keys(icon)[0] as ToggleStatus
            ]
          : icon[status]
        }
      </span>
    </Button>
  )

  return !tooltip ? toggleElement : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {toggleElement}
        </TooltipTrigger>
        <TooltipContent className="tracking-wide">
          {tooltip[status]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

export default StateToggle
