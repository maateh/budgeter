// components
import FilterInput from "@/components/input/FilterInput"
import BudgetMultiSelect from "@/components/input/BudgetMultiSelect"

const BudgetsFilter = () => {
  return (
    <FilterInput className="w-full">
      {() => (
        <BudgetMultiSelect
          selected={[]}
          onSelect={() => {}}
        />
      )}
    </FilterInput>
  )
}

export default BudgetsFilter
