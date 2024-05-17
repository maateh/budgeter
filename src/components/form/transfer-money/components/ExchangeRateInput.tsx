import { Control } from "react-hook-form"

// shadcn
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// hooks
import { useBudget, useExchangeRate } from "@/lib/react-query/queries"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"

// utils
import { formatWithCurrency } from "@/utils"

type ExchangeRateInputProps = {
  rootBudgetId: string
  targetBudgetId?: string
  control: Control<TransferMoneyFieldValues>
}

const ExchangeRateInput = ({ rootBudgetId, targetBudgetId, control }: ExchangeRateInputProps) => {
  const { data: rootBudget } = useBudget(rootBudgetId)

  const { data: targetBudget } = useBudget(targetBudgetId || '', { enabled: !!targetBudgetId })

  const { data: exchangeRate } = useExchangeRate(
    rootBudget?.balance.currency || '',
    targetBudget?.balance.currency || '',
    { enabled: !!rootBudget && !!targetBudget && rootBudget.balance.currency !== targetBudget.balance.currency }
  )

  if (!rootBudget || !targetBudget || !exchangeRate || rootBudget.balance.currency === targetBudget.balance.currency) {
    return
  }

  return (
    <div className="w-full min-w-fit max-w-48 ml-auto space-y-2 sm:w-1/3">
      <Separator />

      <FormField
        control={control}
        name="customExchangeRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exchange Rate</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 1.07"
                {...field}
                value={field.value || exchangeRate}
              />
            </FormControl>
            <FormDescription className="mt-1.5 flex justify-end items-center gap-x-2">
              <span className="pr-1 border-r-2 text-accent tracking-wide font-heading">
                Actual rate
              </span>
              <span className="font-heading">
                {formatWithCurrency(1, rootBudget.balance.currency)}
                {" "}={" "}
                {exchangeRate} {targetBudget.balance.currency}
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default ExchangeRateInput
