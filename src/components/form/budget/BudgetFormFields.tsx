import { UseFormReturn } from "react-hook-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import CurrencySelect from "@/components/input/CurrencySelect"
import ColorPicker from "@/components/input/ColorPicker"

// types
import { BudgetFieldValues } from "@/components/form/budget/types"

type BudgetFormFieldsProps = UseFormReturn<BudgetFieldValues> & {
  type: 'create' | 'edit'
  disabled?: boolean
}

const BudgetFormFields = ({ type, disabled, control }: BudgetFormFieldsProps) => {  
  return (
    <>
      <div className="w-full flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <FormField
          control={control}
          name="name"
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="min-w-56 max-w-sm flex-1">
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

        {type === 'create' && (
          <FormField
            control={control}
            name="balance.currency"
            render={({ field }) => (
              <FormItem className="min-w-36 flex-1">
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <CurrencySelect {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={control}
        name="theme"
        disabled={disabled}
        render={({ field }) => (
          <FormItem className="flex items-center gap-x-2.5">
            <FormLabel>Custom Theme Color</FormLabel>
            <FormControl>
              <ColorPicker {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default BudgetFormFields
