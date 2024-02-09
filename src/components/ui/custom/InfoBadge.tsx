// shadcn
import { Badge, BadgeProps } from "@/components/ui/badge"

type InfoBadgeProps = {
  label: React.ReactNode
  value: React.ReactNode
  size?: BadgeProps['size']
  variant?: BadgeProps['variant']
  icon?: React.JSX.Element
}

const InfoBadge = ({ label, value, variant = "outline", size, icon }: InfoBadgeProps) => {
  return (
    <Badge
      size={size}
      variant={variant}
      className="flex-1 w-full icon-wrapper justify-center"
    >
      {icon}
      <p className="flex justify-between items-center gap-x-2 capitalize">
        {label}
        <span className="pl-2 text-[115%] font-heading font-semibold border-border/70 border-l-2">{value}</span>
      </p>
    </Badge>
  )
}

export default InfoBadge
