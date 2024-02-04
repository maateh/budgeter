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
        <Button variant="outline" size="sm" className="w-full icon-wrapper">
          {selected ? (
            format(selected, 'PPP')
          ) : (
            <span>{label}</span>
          )}
          <CalendarIcon size={18} />
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
