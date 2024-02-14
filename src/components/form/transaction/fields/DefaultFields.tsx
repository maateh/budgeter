import { Control, UseFormWatch } from "react-hook-form"

// icons
import { Minus, Plus } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

// components
import DateTimePicker from "@/components/ui/custom/DateTimePicker"

// models
import Transaction from "@/models/Transaction"

// types
import { FormFields } from "@/components/form/transaction/types"

type DefaultFieldsProps = {
  control: Control<FormFields['default']>
  watch: UseFormWatch<FormFields['default']>
}

const DefaultFields = ({ control, watch }: DefaultFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="label"
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
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Switch
                    checked={field.value as Transaction['status'] === 'processing'}
                    onCheckedChange={() => field.onChange(
                      field.value as Transaction['status'] === 'processing'
                        ? 'processed'
                        : 'processing'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="expectedDate"
            render={({ field }) => watch('status') as Transaction['status'] === 'processing' ? (
              <FormItem className="w-full flex items-center">
                <FormControl>
                  <DateTimePicker
                    label="Expected date..."
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

export default DefaultFields
