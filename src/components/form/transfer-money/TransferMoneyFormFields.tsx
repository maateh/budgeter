import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import BudgetSelect from "@/components/input/BudgetSelect"
import StateToggle from "@/components/ui/custom/StateToggle"
import TransferPreview from "@/components/form/transfer-money/components/TransferPreview"
import ExchangeRateInput from "@/components/form/transfer-money/components/ExchangeRateInput"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"

type TransferMoneyFormFieldsProps = {
  isPending: boolean
  budgetId: string
} & UseFormReturn<TransferMoneyFieldValues>

const TransferMoneyFormFields = ({ isPending, budgetId, control, resetField }: TransferMoneyFormFieldsProps) => {
  const targetBudgetIdField = useWatch({ control, name: 'targetBudgetId' })
  const paymentField = useWatch({ control, name: 'payment' })
  const customExchangeRateField = useWatch({ control, name: 'customExchangeRate' })

  return (
    <>
      <TransferPreview
        rootBudgetId={budgetId}
        targetBudgetId={targetBudgetIdField}
        customExchangeRate={customExchangeRateField}
        payment={{
          ...paymentField,
          createdAt: new Date()
        }}
      />

      <Separator className="w-2/3 mx-auto" />

      <div className="w-full flex flex-wrap justify-around gap-x-8 gap-y-5">
        <FormField
          control={control}
          name="targetBudgetId"
          render={({ field }) => (
            <FormItem className="min-w-48 flex-1">
              <FormLabel>Target Budget</FormLabel>
              <FormControl>
                <BudgetSelect
                  value={field.value}
                  onChange={(id) => {
                    resetField('customExchangeRate')
                    field.onChange(id)
                  }}
                  excludeBy={{ id: budgetId }}
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
        <FormLabel htmlFor="amount">
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
                  <Input id="amount"
                    type="number"
                    placeholder="e.g. $8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <ExchangeRateInput
        rootBudgetId={budgetId}
        targetBudgetId={targetBudgetIdField}
        control={control}
      />

      <Button className="sm:ml-auto sm:w-fit"
        type="submit"
        disabled={isPending}
      >
        Transfer
      </Button>
    </>
  )
}

export default TransferMoneyFormFields
