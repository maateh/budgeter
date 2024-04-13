import { useState } from "react"

// icons
import { Filter, FilterX, X } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Label, LabelProps } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectTriggerProps, SelectValue } from "@/components/ui/select"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// types
import { FilterOptions } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type SelectOption = {
  value: string
  label: string
}

type FilterInputWithSelectProps<F = unknown> = {
  value: string
  setValue: (value: string, filterType: keyof FilterOptions<F>) => void
  options: SelectOption[]
  children?: never
} & Omit<SelectTriggerProps, 'onReset'>

type FilterInputWithoutSelectProps<F = unknown> = {
  children: (type: keyof FilterOptions<F>) => React.ReactNode
  value?: never
  setValue?: never
  options?: never
}

type FilterInputProps<F = unknown> = {
  label: string
  labelProps?: LabelProps
  onReset?: (type: keyof FilterOptions<F>) => void
  onTypeChange?: (type: keyof FilterOptions<F>) => void
} & (FilterInputWithSelectProps<F> | FilterInputWithoutSelectProps<F>)

function FilterInput<F>({
  label, labelProps, onTypeChange, onReset,
  options, value, setValue,
  children, ...props
}: FilterInputProps<F>) {
  const [type, setType] = useState<keyof FilterOptions<F>>('filterBy')

  const handleTypeChange = () => {
    if (!onTypeChange) return

    setType((prevType) => {
      const type = prevType === 'filterBy' ? 'excludeBy' : 'filterBy'
      
      onTypeChange(type)
      return type
    })
  }

  return (
    <div className="my-3.5 flex flex-col gap-y-0.5">
      <Label {...labelProps}
        className={cn("text-base font-heading font-normal", labelProps?.className)}
      >
        Filter by <span className="text-accent capitalize overline">{label}</span>
      </Label>

      <div className="flex justify-between items-center gap-x-2.5">
        {children ? children(type) : (
          <Select
            value={value}
            onValueChange={(value) => setValue(value, type)}
          >
            <SelectTrigger className={cn(!value && "text-muted-foreground")} {...props}>
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex justify-center items-center gap-x-2">
          {onTypeChange && (
            <StateToggle
              status={type === 'filterBy' ? 'on' : 'off'}
              onClick={handleTypeChange}
              icon={{
                on: <Filter className="text-accent" size={16} strokeWidth={2.5} />,
                off: <FilterX className="text-destructive" size={16} strokeWidth={2.5} />
              }}
              tooltip={{
                on: "Switch to exclude",
                off: "Switch to filter"
              }}
              toggleOnHover
            />
          )}

          {onReset && (
            <ButtonTooltip className="p-1"
              variant="outline"
              size="icon"
              onClick={() => onReset(type)}
              tooltip="Clear filter"
            >
              <X size={14} strokeWidth={3.5} />
            </ButtonTooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterInput
