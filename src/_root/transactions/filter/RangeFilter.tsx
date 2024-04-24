import { useState } from "react"

// icons
import { SearchX, TextSearch } from "lucide-react"

// shadcn
import { Button, ButtonTooltip } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import DateRangePicker from "@/components/input/DateRangePicker"
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useFilter } from "@/hooks"

// types
import { DateRange } from "react-day-picker"
import { SearchPaymentRange, TransactionSearchParams } from "@/_root/transactions/filter/types"

const RangeFilter = () => {
  const [paymentRange, setPaymentRange] = useState<SearchPaymentRange>({})

  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined })

  const { setFilterEntry, removeFilterEntries } = useFilter<TransactionSearchParams>()

  const handleSearch = () => {
    setFilterEntry('rangeBy', {
      paymentMin: paymentRange.paymentMin,
      paymentMax: paymentRange.paymentMax,
      dateFrom: dateRange?.from?.getTime().toString(),
      dateTo: dateRange?.to?.getTime().toString()
    })
  }

  const handleClearSearch = () => {
    setPaymentRange({})
    setDateRange({ from: undefined })

    removeFilterEntries('rangeBy', [
      'dateFrom',
      'dateTo',
      'paymentMin',
      'paymentMax'
    ])
  }

  return (
    <div className="h-fit px-6 py-5 space-y-3.5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-red-600 dark:text-red-500">Filter</span> by ranges
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-2.5">
        <FilterInput className="flex-1 min-w-40"
          label={<>Min. <span className="text-red-600 dark:text-red-500 overline">Payment</span></>}
          labelProps={{ htmlFor: 'minPayment' }}
        >
          {() => (
            <Input id="minPayment"
              type="number"
              value={parseInt(paymentRange.paymentMin as string) || ''}
              onChange={(e) => setPaymentRange((prev) => ({ ...prev, paymentMin: e.target.value }))}
            />
          )}
        </FilterInput>

        <FilterInput className="flex-1 min-w-40"
          label={<>Max. <span className="text-red-600 dark:text-red-500 overline">Payment</span></>}
          labelProps={{ className: 'ml-auto', htmlFor: 'maxPayment' }}
        >
          {() => (
            <Input id="maxPayment"
              type="number"
              value={parseInt(paymentRange.paymentMax as string) || ''}
              onChange={(e) => setPaymentRange((prev) => ({ ...prev, paymentMax: e.target.value }))}
            />
          )}
        </FilterInput>
      </div>

      <FilterInput
        label={<>Select <span className="text-red-600 dark:text-red-500 overline">Date Range</span></>}
        labelProps={{ htmlFor: 'dateRange' }}
      >
        {() => (
          <DateRangePicker id="dateRange"
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
