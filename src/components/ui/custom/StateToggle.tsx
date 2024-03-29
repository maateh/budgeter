import { ForwardedRef } from "react"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button, ButtonProps } from "@/components/ui/button"

// utils
import { cn } from "@/lib/utils"

type StateToggleProps<C extends string, U extends string> = {
  status: C | U
  icon: { [key in C | U]: React.ReactNode }
  tooltip?: { [key in C | U]: string }
  toggleOnHover?: boolean
  forwardedRef?: ForwardedRef<HTMLButtonElement>
} & ButtonProps

function StateToggle<C extends string, U extends string>({
  status, icon, tooltip, toggleOnHover, variant = "ghost", size = "icon", className, forwardedRef, ...props
}: StateToggleProps<C, U>) {
  const isChecked = status === Object.keys(icon)[0]

  const element =
    <Button className={cn("toggle hover:bg-foreground/5", toggleOnHover && "hover-toggle-mode", className)}
      variant={variant}
      size={size}
      ref={forwardedRef}
      {...props}
    >
      <span className={cn(isChecked && 'active')}>
        {toggleOnHover
          ? icon[isChecked
              ? Object.keys(icon)[0] as C | U
              : Object.keys(icon)[1] as C | U
            ]
          : icon[status]
        }
      </span>
      <span className={cn(!isChecked && 'active')}>
        {toggleOnHover
          ? icon[isChecked
              ? Object.keys(icon)[1] as C | U
              : Object.keys(icon)[0] as C | U
            ]
          : icon[status]
        }
      </span>
    </Button>

  return !tooltip ? element : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {element}
        </TooltipTrigger>
        <TooltipContent className="tracking-wide">
          {tooltip[status]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StateToggle
