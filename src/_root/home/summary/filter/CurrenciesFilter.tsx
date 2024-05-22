// components
import FilterInput from "@/components/input/FilterInput"
import CurrencyMultiSelect from "@/components/input/CurrencyMultiSelect"

const CurrenciesFilter = () => {
  return (
    <FilterInput className="w-full">
      {() => (
        <CurrencyMultiSelect
          selected={[]}
          onSelect={() => {}}
        />
      )}
    </FilterInput>
  )
}

export default CurrenciesFilter
