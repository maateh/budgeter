import { forwardRef } from "react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Separator, SeparatorProps } from "@/components/ui/separator"

// utils
import { cn } from "@/lib/utils"

export type InfoBadgeProps = {
  value: string
  label?: string
  icon?: React.ReactNode
  orientation?: SeparatorProps['orientation']
  separatorProps?: Omit<SeparatorProps, 'orientation'>
} & BadgeProps

const InfoBadge = forwardRef<HTMLDivElement, InfoBadgeProps>(({
  value, label, icon, className, variant = "outline", orientation = "horizontal", separatorProps, ...props
}, ref) => (
  <Badge className={cn("flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center",
      orientation === 'horizontal' && 'flex-col',
      className
    )}
    variant={variant}
    ref={ref}
    {...props}
  >
    <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5">
      {icon}
      {label && <p>{label}</p>}
    </div>

    <Separator className="w-2/3 my-0.5" orientation={orientation} {...separatorProps} />

    <p className="text-[115%] font-heading font-semibold text-clip break-all">
      {value}
    </p>
  </Badge>
))

export default InfoBadge
