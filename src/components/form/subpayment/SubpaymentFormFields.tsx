import { UseFormReturn } from "react-hook-form"

// icons
import { Check, Minus, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// types
import { SubpaymentFieldValues } from "@/components/form/subpayment/types"
import BudgetSelect from "@/components/input/BudgetSelect"

type SubpaymentFormFieldsProps = UseFormReturn<SubpaymentFieldValues> & {
  isPending: boolean
}

const SubpaymentFormFields = ({ control, isPending }: SubpaymentFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="budgetId"
        render={({ field }) => (
          <FormItem className="min-w-36 flex-1">
            <FormLabel>Budget to Credit</FormLabel>
            <FormControl>
              <BudgetSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel htmlFor="amount">
          Subpayment
        </FormLabel>

        <div className="flex items-center gap-x-2.5">
          <FormField
            control={control}
            name="type"
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
                      on: <Plus size={18} strokeWidth={4} />,
                      off: <Minus size={18} strokeWidth={4} />
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className="h-9" id="amount"
                    type="number"
                    placeholder="e.g. $8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="text-green-400 icon-wrapper"
            variant="icon"
            size="icon"
            type="submit"
            disabled={isPending}
          >
            <Check size={18} strokeWidth={4} />
          </Button>
        </div>
      </div>
    </>
  )
}

export default SubpaymentFormFields
