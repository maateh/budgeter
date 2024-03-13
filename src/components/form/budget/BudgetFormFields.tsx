import { UseFormReturn } from "react-hook-form"

// icons
import { BookMinus, BookPlus } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// components
import StateToggle from "@/components/ui/custom/StateToggle"
import ColorPicker from "@/components/input/ColorPicker"

// hooks
import { useCurrencies } from "@/lib/react-query/queries"

// types
import { BudgetFieldValues } from "@/components/form/budget/types"
import { Budget } from "@/services/api/types"

type BudgetFormFieldsProps = {
  form: UseFormReturn<BudgetFieldValues>
  disabled?: boolean
}

const BudgetFormFields = ({ form, disabled }: BudgetFormFieldsProps) => {
  const { control } = form
  
  const {
    data: currencies,
    isLoading: currenciesIsLoading
  } = useCurrencies()

  return (
    <>
      <div className="w-full flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <FormField
          control={control}
          name="name"
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="min-w-56 flex-1">
              <FormLabel>Budget Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g. Cash"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="balance.currency"
          disabled={!currencies || currenciesIsLoading}
          render={({ field }) => (
            <FormItem className="min-w-36 flex-1">
              <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies && Object.entries(currencies).map(([key, currency]) => (
                      <SelectItem key={key} value={key}>
                        <span className="font-semibold mr-2 pr-2 border-r">{key}</span>
                        <span className="font-medium">{currency}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="w-full flex gap-x-5">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-y-1">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <StateToggle<Budget['type'], Budget['type']>
                  type="button"
                  className={`rounded-xl p-1.5
                    ${field.value === 'income'
                      ? 'bg-blue-500 hover:bg-blue-500/90'
                      : 'bg-red-500 hover:bg-red-500/90'}
                  `}
                  status={field.value as Budget['type']}
                  icon={{
                    income: <BookPlus size={22} strokeWidth={2.75} />,
                    expense: <BookMinus size={22} strokeWidth={2.75} />
                  }}
                  tooltip={{ income: 'Income', expense: 'Expense' }}
                  action={() => field.onChange(field.value === 'income' ? 'expense' : 'income')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="balance.ceiling"
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="min-w-[38%]">
              <FormLabel>Expected Ceiling</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. $200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="theme"
        disabled={disabled}
        render={({ field }) => (
          <FormItem className="flex items-center gap-x-2.5">
            <FormLabel>Custom Theme Color</FormLabel>
            <FormControl>
              <ColorPicker
                color={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default BudgetFormFields
