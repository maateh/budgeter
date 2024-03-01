import { UseFormReturn, useWatch } from "react-hook-form"

// icons
import { AlarmClock, Minus, Plus, Receipt } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

// components
import TabsSelector from "@/components/input/TabsSelector"
import BudgetSelector from "@/components/input/BudgetSelector"
import DateTimePicker from "@/components/input/DateTimePicker"

// types
import { Transaction } from "@/services/api/types"
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
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center gap-y-1.5 text-center">
            <FormLabel className="text-lg small-caps">
              Select the <span className="text-muted font-medium overline">type of transaction</span>
            </FormLabel>
            <FormControl>
              <TabsSelector<Transaction['type']>
                tabItems={[
                  { value: 'default', Icon: Receipt },
                  { value: 'temporary', Icon: AlarmClock }
                ]}
                setValue={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="w-full flex flex-wrap justify-around gap-x-8">
        {!budgetId && (
          <FormField
            control={control}
            name="budgetId"
            render={({ field }) => (
              <FormItem className="min-w-36 flex-1">
                <FormLabel>Select a Budget</FormLabel>
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

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="min-w-52 flex-1">
              <FormLabel>Transaction Name</FormLabel>
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
      </div>

      <div>
        <FormLabel>Payment</FormLabel>

        <div className="flex items-center gap-x-2 5">
          <FormField
            control={control}
            name="payment.type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* TODO: replace later with StatusSwitch */}
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
      </div>

      <div className="flex flex-col gap-y-1.5">
        <FormField
          control={control}
          name="processed"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-2.5">
              <FormLabel>Already Processed</FormLabel>
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
            <FormItem className="max-w-80">
              <FormControl>
                <DateTimePicker
                  label="Select the processing date..."
                  selected={field.value!}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) : <></>}
        />
      </div>
    </>
  )
}

export default TransactionFormFields
