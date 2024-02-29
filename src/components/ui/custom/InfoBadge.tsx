import { forwardRef } from "react"

// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

// utils
import { cn } from "@/lib/utils"

type InfoBadgeProps = {
  label: React.ReactNode
  value: React.ReactNode
  icon?: React.JSX.Element
} & BadgeProps

const InfoBadge = forwardRef<HTMLDivElement, InfoBadgeProps>(({
  label, value, icon, className, variant = "outline", size, ...props
}, ref) => (
  <Badge className={cn("flex-1 w-full icon-wrapper justify-center", className)}
    variant={variant}
    size={size}
    ref={ref}
    {...props}
  >
    {icon}
    <p className="flex justify-between items-center gap-x-2 capitalize">
      {label}
      <span className="pl-2 text-[115%] font-heading font-semibold border-border/70 border-l-2">{value}</span>
    </p>
  </Badge>
))

export default InfoBadge
