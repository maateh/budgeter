// shadcn
import { Separator } from "@/components/ui/separator"

// components
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"

const AdvancedFilter = () => {
  const {
    params,
    setFilterParam,
    removeFilterParam,
    toggleFilterType
  } = useFilter<Transaction>()

  return (
    <div className="h-fit px-6 py-5 space-y-3.5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-red-600 dark:text-red-500">Filter</span> by ranges
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      {/* TODO: add payment filter (amount of the payment more or less than xy) */}

      {/* TODO: add date filter (using shadcn's DateRangePicker) */}
    </div>
  )
}

export default AdvancedFilter
