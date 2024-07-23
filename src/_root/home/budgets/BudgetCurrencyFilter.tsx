import { useMemo } from "react"

// shadcn
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SkeletonList } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// hooks
import { useBudgets } from "@/lib/react-query/queries"

// utils
import { getUsedCurrencies } from "@/_root/home/utils"

type BudgetCurrencyFilterProps = {
  setCurrencyFilter: React.Dispatch<React.SetStateAction<string | undefined>>
}

const BudgetCurrencyFilter = ({ setCurrencyFilter }: BudgetCurrencyFilterProps) => {
  const { data: budgets, isLoading: isBudgetsLoading } = useBudgets()
  
  const currencies = useMemo(() => {
    return getUsedCurrencies(budgets || [])
  }, [budgets])
  
  if (!budgets || isBudgetsLoading) {
    return (
      <SkeletonList className="mx-4 flex flex-wrap flex-row items-center gap-x-3 gap-y-2.5"
        itemProps={{ className: "h-5 w-14" }}
        amount={5}
      />
    )
  }

  if (currencies.length <= 1) return

  return (
    <div className="my-2 mx-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <Label className="text-base font-heading font-normal indent-border">
        <span className="text-emerald-500 dark:text-emerald-300 font-medium overline">Filter</span> by
      </Label>

      <Separator className="h-3.5 w-1 rounded-full bg-foreground/10" orientation="vertical" />

      <ToggleGroup className="flex-wrap justify-start gap-x-2" type="single">
        {currencies.map((currency) => (
          <ToggleGroupItem value={currency.value} key={currency.value}
            size="xs"
            variant="outline"
            onClick={() => {
              setCurrencyFilter((prev) => prev !== currency.value ? currency.value : undefined)
            }}
          >
            {currency.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default BudgetCurrencyFilter
