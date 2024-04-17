import React, { useState } from "react"

// icons
import { Eraser, Filter, FilterX } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { Label, LabelProps } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectTriggerProps, SelectValue } from "@/components/ui/select"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// types
import { FilterKeys } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type SelectOption = {
  value: string
  label: string
}

type FilterInputWithSelectProps = {
  value: string
  setValue: (value: string, filterType: FilterKeys) => void
  options: SelectOption[]
  triggerProps?: Omit<SelectTriggerProps, 'onReset'>
  children?: never
}

type FilterInputWithoutSelectProps = {
  children: (type: FilterKeys) => React.ReactNode
  value?: never
  setValue?: never
  options?: never
  triggerProps?: never
}

type FilterInputProps = {
  label?: React.ReactNode
  labelProps?: LabelProps
  onReset?: (type: FilterKeys) => void
  onTypeChange?: (type: FilterKeys) => void
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'onReset'>
  & (FilterInputWithSelectProps | FilterInputWithoutSelectProps)

function FilterInput({
  label, labelProps, onTypeChange, onReset,
  options, value, setValue, triggerProps,
  children, className, ...props
}: FilterInputProps) {
  const [type, setType] = useState<FilterKeys>('filterBy')

  const handleTypeChange = () => {
    if (!onTypeChange) return

    setType((prevType) => {
      const type = prevType === 'filterBy' ? 'excludeBy' : 'filterBy'
      
      onTypeChange(type)
      return type
    })
  }

  return (
    <div className={cn("flex flex-col gap-y-0.5", className)} {...props}>
      {label && (
        <Label {...labelProps}
          className={cn("text-base font-heading font-normal", labelProps?.className)}
        >
          {label}
        </Label>
      )}

      <div className="flex justify-between items-center gap-x-2.5">
        {children ? children(type) : (
          <Select
            value={value}
            onValueChange={(value) => setValue(value, type)}
          >
            <SelectTrigger {...triggerProps}
              className={cn(!value && "text-muted-foreground", triggerProps?.className)}
            >
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

        <div className="flex justify-center items-center gap-x-1">
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
            <ButtonTooltip className="p-1.5 hover:bg-foreground/5"
              variant="ghost"
              size="icon"
              onClick={() => onReset(type)}
              tooltip="Clear filter"
            >
              <Eraser size={14} strokeWidth={2.5} />
            </ButtonTooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterInput
