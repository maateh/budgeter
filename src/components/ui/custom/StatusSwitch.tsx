import { Ref, useState } from "react"

// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button, ButtonProps } from "@/components/ui/button"

// utils
import { cn } from "@/lib/utils"

type CustomRef = {
  ref?: Ref<HTMLButtonElement>
}

type StatusSwitchProps<S extends string> = {
  status: S
  icon: { [key in S]: React.ReactNode }
  label: { [key in S]: string }
  handleSwitch: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
} & ButtonProps & CustomRef

function StatusSwitch<S extends string>({
  status, icon, label, handleSwitch, className, size = "icon-sm", ref, ...props
}: StatusSwitchProps<S>) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className={cn("hover:bg-foreground/5", className)}
            variant="ghost"
            size={size}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleSwitch}
            ref={ref}
            {...props}
          >
            {isHovered ? icon[status === Object.keys(icon)[0]
              ? Object.keys(icon)[1] as S
              : Object.keys(icon)[0] as S
            ] : icon[status]}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="tracking-wide">
          {label[status]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StatusSwitch
