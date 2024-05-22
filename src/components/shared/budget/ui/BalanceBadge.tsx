import { forwardRef } from "react"

// icons
import { LucideProps, Wallet } from "lucide-react"

// components
import InfoBadge, { InfoBadgeProps } from "@/components/ui/custom/InfoBadge"

// types
import { Budget } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

export type BalanceBadgeProps = {
  balance: Pick<Budget['balance'], 'current' | 'currency'>
  iconProps?: LucideProps
  customLabel?: string
} & Omit<InfoBadgeProps, 'label' | 'icon' | 'value'>

const BalanceBadge = forwardRef<HTMLDivElement, BalanceBadgeProps>(({
  balance, iconProps, customLabel, className, ...props
}, ref) => (
  <InfoBadge className={cn("w-fit",
      balance.current > 0
        ? 'bg-green-700/10 hover:bg-green-700/15 text-green-700 border-green-700 dark:text-green-400 dark:border-green-400'
        : 'bg-destructive/10 hover:bg-destructive/15 text-destructive border-destructive', className)}
    label={customLabel === undefined ? 'Current Balance' : customLabel}
    value={formatWithCurrency(balance.current, balance.currency)}
    icon={<Wallet {...iconProps} />}
    ref={ref}
    {...props}
  />
))

export default BalanceBadge
