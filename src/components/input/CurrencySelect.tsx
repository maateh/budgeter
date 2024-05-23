import { forwardRef } from "react"

// shadcn
import { Select, SelectContent, SelectItem, SelectTrigger, SelectTriggerProps, SelectValue } from "@/components/ui/select"

// hooks
import { useCurrencies } from "@/lib/react-query/queries"

// utils
import { cn } from "@/lib/utils"

type CurrencySelectProps = {
  value?: string
  onChange: (id: string) => void
} & Omit<SelectTriggerProps, 'value' | 'onChange'>

const CurrencySelect = forwardRef<HTMLButtonElement, CurrencySelectProps>(({ value, onChange, ...props }, ref) => {
  const { data: currencies, isLoading } = useCurrencies()

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={!currencies || isLoading}
    >
      <SelectTrigger className={cn(!value && "text-muted-foreground")} ref={ref} {...props}>
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        {currencies?.map(([key, currency]) => (
          <SelectItem key={key} value={key}>
            <span className="font-semibold mr-2 pr-2 border-r">{key}</span>
            <span className="font-medium">{currency}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

export default CurrencySelect
