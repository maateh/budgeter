import { format } from "date-fns"

// icons
import { CalendarIcon, Clock } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { TimePickerInput } from "@/components/ui/time-picker"

type DateTimePickerProps = {
  label?: string
  value: Date
  onChange: (date?: Date) => void
}

const DateTimePicker = ({ label = "Pick a date", value, onChange }: DateTimePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full icon-wrapper font-normal"
          variant="outline"
          size="sm"
        >
          <CalendarIcon size={18} />
          {value && label ? format(value, 'yyyy. MM. dd. HH:mm') : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />

        <Separator className="w-5/6 mx-auto my-2" />

        <Clock className="size-4 mx-auto" strokeWidth={3} />
        <TimePickerInput
          layoutProps={{ className: "mx-auto mt-4" }}
          date={value}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker
