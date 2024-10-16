// icons
import { AlertTriangle, BadgeInfo, Minus, Plus } from "lucide-react"

// shadcn
import { BadgeTooltip } from "@/components/ui/badge"

// components
import InfoBadge, { InfoBadgeProps } from "@/components/ui/custom/InfoBadge"
import BalanceBadge, { BalanceBadgeProps } from "@/components/shared/budget/ui/BalanceBadge"

// types
import { Balance } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"
import { cn } from "@/lib/utils"

type BalanceSummaryProps = {
  balance: Balance
  showIncomeAndLoss?: boolean
  balanceBadgeProps?: Omit<BalanceBadgeProps, 'balance'>
  incomeAndLossBadgeProps?: Omit<InfoBadgeProps, 'label' | 'value' | 'icon'>
  borrowmentsBadgeProps?: Omit<InfoBadgeProps, 'variant' | 'label' | 'value' | 'icon'>
}

const BalanceSummary = ({
  balance, showIncomeAndLoss = false,
  balanceBadgeProps,
  incomeAndLossBadgeProps,
  borrowmentsBadgeProps
}: BalanceSummaryProps) => {
  return (
    <div className="flex flex-col gap-y-3.5">
      <div className="flex flex-col items-center gap-5 small-caps">
        <BalanceBadge {...balanceBadgeProps}
          className={cn("w-full px-8 py-3 max-w-72 min-w-48", balanceBadgeProps?.className)}
          size={balanceBadgeProps?.size || 'lg'}
          iconProps={balanceBadgeProps?.iconProps || { size: 22, strokeWidth: 2.5 }}
          balance={balance}
        />
      </div>

      {showIncomeAndLoss && (
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <InfoBadge {...incomeAndLossBadgeProps}
            className={cn("text-accent border-accent bg-background/65", incomeAndLossBadgeProps?.className)}
            separatorProps={incomeAndLossBadgeProps?.separatorProps || { className: "h-4" }}
            size={incomeAndLossBadgeProps?.size || 'sm'}
            orientation={incomeAndLossBadgeProps?.orientation || 'vertical'}
            label="Income"
            value={formatWithCurrency(balance.income, balance.currency)}
          />
  
          <InfoBadge {...incomeAndLossBadgeProps}
            className={cn("text-destructive border-destructive bg-background/65", incomeAndLossBadgeProps?.className)}
            separatorProps={incomeAndLossBadgeProps?.separatorProps || { className: "h-4" }}
            size={incomeAndLossBadgeProps?.size || 'sm'}
            orientation={incomeAndLossBadgeProps?.orientation || 'vertical'}
            label="Loss"
            value={formatWithCurrency(balance.loss, balance.currency)}
          />
        </div>
      )}

      <div className="space-y-2.5">
        <h3 className="mt-3.5 mx-auto px-3.5 indent-border">
          Money <span className="text-muted-foreground/75 overline">Under Borrowment</span>
        </h3>

        <div className="mx-2.5 flex flex-wrap justify-around items-center gap-y-2 gap-x-4 font-semibold sm:gap-x-12">
          <div className="flex-1 flex justify-center gap-x-1.5">
            <BadgeTooltip className="cursor-pointer"
              tooltipProps={{ className: "max-w-sm hover:bg-background", asChild: true }}
              variant="ghost"
              size="icon"
              tooltip={(
                <InfoBadge className="flex-1 h-fit px-6 py-2 min-w-36 max-w-80"
                  valueProps={{ className: "text-xs font-normal tracking-wider break-words" }}
                  variant="accent"
                  value="This amount of money is the loans that you have borrowed from someone and are currently increasing your balance. (You might have to pay it back.)"
                  icon={<AlertTriangle className="text-accent" size={20} />}
                />
              )}
            >
              <BadgeInfo className="text-muted-foreground" size={20} />
            </BadgeTooltip>

            <InfoBadge {...borrowmentsBadgeProps}
              className={cn("flex-1 h-fit px-6 py-2 min-w-36 max-w-80", borrowmentsBadgeProps?.className)}
              separatorProps={borrowmentsBadgeProps?.separatorProps || { className: "h-5" }}
              orientation={borrowmentsBadgeProps?.orientation || 'vertical'}
              size={borrowmentsBadgeProps?.size || 'sm'}
              variant="accent"
              label="Borrowments"
              value={formatWithCurrency(balance.borrowment.plus, balance.currency)}
              icon={<Plus className="text-accent" size={20} strokeWidth={5} />}
            />
          </div>

          <div className="flex-1 flex justify-center gap-x-1.5">
            <InfoBadge {...borrowmentsBadgeProps}
              className={cn("flex-1 h-fit px-6 py-2 min-w-36 max-w-80", borrowmentsBadgeProps?.className)}
              separatorProps={borrowmentsBadgeProps?.separatorProps || { className: "h-5" }}
              orientation={borrowmentsBadgeProps?.orientation || 'vertical'}
              size={borrowmentsBadgeProps?.size || 'sm'}
              variant="destructive"
              label="Borrowments"
              value={formatWithCurrency(balance.borrowment.minus, balance.currency)}
              icon={<Minus className="text-destructive" size={20} strokeWidth={5} />}
            />

            <BadgeTooltip className="cursor-pointer"
              tooltipProps={{ className: "max-w-sm hover:bg-background", asChild: true }}
              variant="ghost"
              size="icon"
              tooltip={(
                <InfoBadge className="flex-1 h-fit px-6 py-2 min-w-36 max-w-80"
                  valueProps={{ className: "text-xs font-normal tracking-wider break-words" }}
                  variant="destructive"
                  value="This amount of money is the loans that you have lent to someone and are currently reducing your balance. (This will likely be refunded.)"
                  icon={<AlertTriangle className="text-destructive" size={20} />}
                />
              )}
            >
              <BadgeInfo className="text-muted-foreground" size={20} />
            </BadgeTooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export { BalanceSummary }
export { default as BalanceSummarySkeleton } from './BalanceSummary.skeleton'
