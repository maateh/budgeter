import { forwardRef, useState } from "react"

// shadcn
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// utils
import { cn } from "@/lib/utils"

type TimePickerType = "hours" | "minutes" | "seconds"

function isValidHour(value: string) {
  return /^(?:0*([0-9]|1[0-9]|2[0-3]))$/.test(value)
}

function isValidMinuteOrSecond(value: string) {
  return /^(?:0*[0-9]|0*[1-5][0-9])$/.test(value)
}

interface TimeInputProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'type'> {
  type: TimePickerType
  date: Date
  onChange: (date: Date) => void
  defaultValue?: number
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(({
  type, date, onChange, defaultValue = 0,
  className, ...props
}, ref) => {
  const [value, setValue] = useState<number>(defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = parseInt(value)

    if (type === 'hours') {
      if (!isValidHour(value)) return
      date.setHours(numericValue)
    }

    if (type === 'minutes') {
      if (!isValidMinuteOrSecond(value)) return
      date.setMinutes(numericValue)
    }

    if (type === 'seconds') {
      if (!isValidMinuteOrSecond(value)) return
      date.setSeconds(numericValue)
    }

    onChange(date)
    setValue(numericValue)
  }

  return (
    <Label className="relative text-center">
      <span className="absolute -top-4 inset-x-0 text-xs font-semibold all-small-caps capitalize">{type}</span>
      <Input className={cn("w-12 text-center font-mono tabular-nums focus:bg-accent/90 focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none", className)}
        value={value.toString().padStart(2, '0')}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    </Label>
  )
})

interface TimePickerInputProps extends Omit<TimeInputProps, 'type'> {
  showMinutes?: boolean
  layoutProps?: React.HTMLAttributes<HTMLDivElement>
}
 
const TimePickerInput = forwardRef<HTMLInputElement, TimePickerInputProps>(({
  date, showMinutes = false, layoutProps, ...props
}, ref) => (
  <div {...layoutProps} className={cn("w-fit flex items-center gap-x-2.5", layoutProps?.className)}>
    <TimeInput {...props}
      date={date}
      type="hours"
      defaultValue={date.getHours()}
      ref={ref}
    />

    <TimeInput {...props}
      date={date}
      type="minutes"
      defaultValue={date.getMinutes()}
      ref={ref}
    />

    {showMinutes && (
      <TimeInput {...props}
        date={date}
        type="seconds"
        defaultValue={date.getSeconds()}
        ref={ref}
      />
    )}
  </div>
))
 
TimePickerInput.displayName = "TimePickerInput"
 
export { TimePickerInput }
