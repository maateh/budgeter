import { UseFormReturn } from "react-hook-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

// components
import ColorPicker from "@/components/ui/custom/ColorPicker"

// hooks
import { useLoadCurrencies } from "@/components/form/budget/hooks"

// models
import { BudgetType } from "@/models/Budget"

// types
import { FieldValues } from "@/components/form/budget/types"

type BudgetFormFieldsProps = {
  form: UseFormReturn<FieldValues['budget']>
}

const BudgetFormFields = ({ form }: BudgetFormFieldsProps) => {
  const { control } = form
  const {
    data: currencies,
    isLoading: currenciesIsLoading
  } = useLoadCurrencies()

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-heading text-xl small-caps">
              Budget Name
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="e.g. Food"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-heading text-xl small-caps">
                Type
              </FormLabel>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-x-6 gap-y-3"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={BudgetType.INCOME} />
                    </FormControl>
                    <FormLabel className="text-md font-semibold cursor-pointer">
                      {BudgetType.INCOME}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={BudgetType.EXPENSE} />
                    </FormControl>
                    <FormLabel className="text-md font-semibold cursor-pointer">
                      {BudgetType.EXPENSE}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex-1 flex items-end gap-x-4">
          <FormField
            control={control}
            name="balance.ceiling"
            render={({ field }) => (
              <FormItem className="sm:min-w-48 flex-1">
                <FormLabel className="font-heading text-xl small-caps">
                  Expected Ceiling
                </FormLabel>
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

          <FormField
            control={control}
            name="currency"
            render={({ field }) => (
              <FormItem className="max-w-48 flex-1">
                <FormLabel className="font-heading text-xl small-caps">
                  Currency
                </FormLabel>
                  <Select
                    disabled={!currencies || currenciesIsLoading}
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
      </div>

      <div className="flex flex-col justify-center gap-y-2">
        <FormField
          control={control}
          name="theme.background"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-4">
              <FormLabel className="font-heading text-xl small-caps">
                Custom Background Color
              </FormLabel>
              <FormControl>
                <>
                  <Input type="hidden" {...field} />
                  <ColorPicker
                    color={field.value}
                    onChange={field.onChange}
                  />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="theme.foreground"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-4">
              <FormLabel className="font-heading text-xl small-caps">
                Custom Foreground Color
              </FormLabel>
              <FormControl>
                <>
                  <Input type="hidden" {...field} />
                  <ColorPicker
                    color={field.value}
                    onChange={field.onChange}
                  />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default BudgetFormFields