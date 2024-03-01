import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

// components
import BudgetSelector from "@/components/input/BudgetSelector"
import DateTimePicker from "@/components/input/DateTimePicker"

// types
import { TransactionFieldValues } from "@/components/form/transaction/types"

type TransactionFormFieldsProps = {
  budgetId?: string
  form: UseFormReturn<TransactionFieldValues>
}

const TransactionFormFields = ({ budgetId, form }: TransactionFormFieldsProps) => {
  const { control } = form

  const processedField = useWatch({
    control: control,
    name: 'processed'
  })

  return (
    <>
      <div className="w-full flex flex-wrap justify-around gap-x-8">
        {!budgetId && (
          <FormField
            control={control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="w-1/2 flex-1">
                <FormLabel className="font-heading font-normal normal-case">
                  Select a Budget
                </FormLabel>
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
        )}
      </div>

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-heading text-md font-normal small-caps">
              Label
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="e.g. Chocolate"
                className="h-9"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center gap-x-2">
        <FormField
          control={control}
          name="payment.type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  <Input type="hidden" {...field} />
                  <Button
                    type="button"
                    variant="icon"
                    size="icon"
                    border="icon"
                    className={field.value === '+'
                      ? 'bg-green-500/50 hover:bg-green-500/60'
                      : 'bg-red-500/80 hover:bg-red-500/90'
                    }
                    onClick={() => {
                      field.onChange(field.value === '+' ? '-' : '+')
                    }}
                  >
                    {field.value === '+' ? (
                      <Plus size={16} />
                    ) : (
                      <Minus size={16} />
                    )}
                  </Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="payment.amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
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

      <div>
        <FormLabel className="font-heading text-md font-normal small-caps">
          Under Processing
        </FormLabel>

        <div className="h-max flex items-center justify-between gap-x-2">
          <FormField
            control={control}
            name="processed"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="processedAt"
            render={({ field }) => processedField ? (
              <FormItem className="w-full">
                <FormControl>
                  <DateTimePicker
                    label="Select expected date..."
                    selected={field.value!}
                    onSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) : <></>}
          />
        </div>
      </div>
    </>
  )
}

export default TransactionFormFields
