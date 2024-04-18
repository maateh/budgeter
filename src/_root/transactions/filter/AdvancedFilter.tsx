// shadcn
import { Separator } from "@/components/ui/separator"

// components
import DateRangePicker from "@/components/input/DateRangePicker"
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"

const AdvancedFilter = () => {
  const { filterParams, setFilterParam, removeFilterParam } = useFilter<Transaction>()

  return (
    <div className="h-fit px-6 py-5 space-y-3.5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-red-600 dark:text-red-500">Filter</span> by ranges
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      {/* TODO: add payment filter (amount of the payment more or less than xy) */}

      {/* TODO: add option to filter by date & ranges */}
      <FilterInput
        label={<>Filter by <span className="text-red-600 dark:text-red-500 overline">Last Updated</span></>}
      >
        {(filterType) => (
          <DateRangePicker
            // date={{
            //   from: filterParams.dateFrom,
            //   to: filterParams.dateTo
            // }}
            // onSelect={(date) => setFilterParam(date, filterType)}
            onSelect={() => {}}
          />
        )}
      </FilterInput>
    </div>
  )
}

export default AdvancedFilter
