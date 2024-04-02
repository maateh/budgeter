import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import StateToggle from "@/components/ui/custom/StateToggle"
import BudgetSelector from "@/components/input/BudgetSelector"
import TransferPreview from "@/components/shared/transfer-money/TransferPreview"

// hooks
import { useBudget } from "@/lib/react-query/queries"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"

type TransferMoneyFormFieldsProps = {
  budgetId: string
} & UseFormReturn<TransferMoneyFieldValues>

const TransferMoneyFormFields = ({ budgetId, control }: TransferMoneyFormFieldsProps) => {
  const targetBudgetIdField = useWatch({
    control,
    name: 'targetBudgetId'
  })

  const paymentField = useWatch({
    control,
    name: 'payment'
  })

  const { data: rootBudget, isLoading: isRootBudgetLoading } = useBudget(budgetId)
  const { data: targetBudget } = useBudget(targetBudgetIdField)

  return (
    <>
      {!isRootBudgetLoading && rootBudget && (
        <TransferPreview
          rootBudget={rootBudget}
          targetBudget={targetBudget}
          // FIXME: payment={paymentField}
        />
      )}

      <Separator className="w-2/3 mx-auto" />

      <div className="w-full flex flex-wrap justify-around gap-x-8 gap-y-5">
        <FormField
          control={control}
          name="targetBudgetId"
          render={({ field }) => (
            <FormItem className="min-w-48 flex-1">
              <FormLabel>Select Target Budget</FormLabel>
              <FormControl>
                <BudgetSelector
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="min-w-52 flex-1">
              <FormLabel>Transfer Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder='e.g. "Deposit money into bank account"'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormLabel>
          Transfer Amount
        </FormLabel>
        <div className="flex items-center gap-x-2.5">
          <FormField
            control={control}
            name="payment.type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <StateToggle
                    type="button"
                    className={`rounded-xl p-1.5
                      ${field.value === '+'
                        ? 'bg-accent hover:bg-accent/90'
                        : 'bg-red-500 hover:bg-red-500/90'}
                    `}
                    status={field.value === '+' ? 'on' : 'off'}
                    icon={{
                      on: <Plus size={20} strokeWidth={4} />,
                      off: <Minus size={20} strokeWidth={4} />
                    }}
                    onClick={() => field.onChange(field.value === '+' ? '-' : '+')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="payment.amount"
            render={({ field }) => (
              <FormItem className="min-w-[40%]">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. $50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Button className="sm:ml-auto sm:w-fit"
        type="submit"
      >
        Transfer {targetBudget && `to "${targetBudget.name}"`} 
      </Button>
    </>
  )
}

export default TransferMoneyFormFields
