import { UseFormReturn } from "react-hook-form"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// types
import { TransferMoneyFieldValues } from "@/components/form/transfer-money/types"
import { Transaction } from "@/services/api/types"
import { Button } from "@/components/ui/button"

type TransferMoneyFormFieldsProps = UseFormReturn<TransferMoneyFieldValues>

const TransferMoneyFormFields = ({ control }: TransferMoneyFormFieldsProps) => {
  // TODO: add targetBudgetId selector

  // TODO: create a bit of "interactive" layout to display changes
  // on the root and target budgets how their balances will grow or decrease
  // based on the given payment

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
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
                  <StateToggle<Transaction['payment']['type'], Transaction['payment']['type']>
                    type="button"
                    className={`rounded-xl p-1.5
                      ${field.value === '+'
                        ? 'bg-accent hover:bg-accent/90'
                        : 'bg-red-500 hover:bg-red-500/90'}
                    `}
                    status={field.value as Transaction['payment']['type']}
                    icon={{
                      "+": <Plus size={20} strokeWidth={4} />,
                      '-': <Minus size={20} strokeWidth={4} />
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
        Execute
      </Button>
    </>
  )
}

export default TransferMoneyFormFields
