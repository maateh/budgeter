import { format } from "date-fns"
import { SelectSingleEventHandler } from "react-day-picker"

// icons
import { CalendarIcon } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type DateTimePickerProps = {
  label?: string
  selected: Date
  onSelect: SelectSingleEventHandler
}

const DateTimePicker = ({ label = "Pick a date", selected, onSelect }: DateTimePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full icon-wrapper font-normal"
          variant="outline"
          size="sm"
        >
          <CalendarIcon size={18} />
          {selected ? format(selected, 'yyyy. MM. dd. HH:mm') : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {/* TODO: implement time picker */}
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker
