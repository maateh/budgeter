import { UseFormReturn } from "react-hook-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// components
import ColorPicker from "@/components/input/ColorPicker"

// hooks
import { useCurrencies } from "@/lib/react-query/queries"

// types
import { BudgetFieldValues } from "@/components/form/budget/types"

type BudgetFormFieldsProps = UseFormReturn<BudgetFieldValues> & {
  disabled?: boolean
}

const BudgetFormFields = ({ control, disabled }: BudgetFormFieldsProps) => {  
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

      <FormField
        control={control}
        name="theme"
        disabled={disabled}
        render={({ field }) => (
          <FormItem className="flex items-center gap-x-2.5">
            <FormLabel htmlFor="theme">Custom Theme Color</FormLabel>
            <FormControl>
              <ColorPicker id="theme"
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
