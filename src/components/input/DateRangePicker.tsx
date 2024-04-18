import { DateRange } from "react-day-picker"

// icons
import { CalendarCheck2, CalendarSearch } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// utils
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
  dateRange?: DateRange
  onSelect: (dateRange?: DateRange) => void
} & Omit<ButtonProps, 'onSelect'>

const DateRangePicker = ({
  dateRange, onSelect,
  className, variant = "outline", size = "sm", ...props
}: DateRangePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("w-full h-fit p-2 flex flex-col font-normal", className)}
          variant={variant}
          size={size}
          {...props}
        >
          <div className="icon-wrapper">
            <CalendarSearch size={20} strokeWidth={2.35} />
            <p className="flex gap-x-1.5">
              Start Date
              <span className="pl-1.5 border-l-2 font-medium">
                {dateRange?.from ? format(dateRange.from, 'yyyy. MM. dd.') : 'Select...'}
              </span>
            </p>
          </div>

          <Separator className="w-1/2 my-2 bg-foreground/40" />

          <div className="icon-wrapper">
            <CalendarCheck2 size={20} strokeWidth={2.35} />
            <p className="flex gap-x-1.5">
              End Date
              <span className="pl-1.5 border-l-2 font-medium">
                {dateRange?.to ? format(dateRange.to, 'yyyy. MM. dd.') : 'Select...'}
              </span>
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="range"
          defaultMonth={dateRange?.to}
          selected={dateRange}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker
