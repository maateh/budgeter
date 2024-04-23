import { useState } from "react"

// icons
import { SearchX, TextSearch } from "lucide-react"

// shadcn
import { Button, ButtonTooltip } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import DateRangePicker from "@/components/input/DateRangePicker"
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useFilter } from "@/hooks"

// types
import { DateRange } from "react-day-picker"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"

// utils
import { addDays } from "date-fns"

const date = new Date()

const RangeFilter = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(date, -date.getDate() + 1),
    to: date
  })

  const { setFilterEntry, removeFilterEntry } = useFilter<TransactionSearchParams>()

  const handleSearch = () => {
    /** Set date range params */
    setFilterEntry('rangeBy', {
      dateFrom: dateRange?.from?.getTime().toString(),
      dateTo: dateRange?.to?.getTime().toString()
    })
  }

  const handleClearSearch = () => {
    removeFilterEntry('rangeBy', 'dateFrom')
    removeFilterEntry('rangeBy', 'dateTo')
  }

  return (
    <div className="h-fit px-6 py-5 space-y-3.5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-red-600 dark:text-red-500">Filter</span> by ranges
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      {/* TODO: add payment filter (amount of the payment more or less than xy) */}

      <FilterInput
        label={<>Filter by <span className="text-red-600 dark:text-red-500 overline">Last Updated</span></>}
      >
        {() => (
          <DateRangePicker
            dateRange={dateRange}
            onSelect={setDateRange}
          />
        )}
      </FilterInput>

      <div className="pt-1.5 flex justify-end items-center gap-x-2">
        <ButtonTooltip className="icon-wrapper"
          tooltip="Clear search"
          variant="destructive"
          size="icon"
          onClick={handleClearSearch}
        >
          <SearchX size={14} strokeWidth={2.35} />
        </ButtonTooltip>

        <Button className="px-4 icon-wrapper"
          size="sm"
          onClick={handleSearch}
        >
          <TextSearch size={18} strokeWidth={3} />
          <span>Search</span>
        </Button>
      </div>
    </div>
  )
}

export default RangeFilter
