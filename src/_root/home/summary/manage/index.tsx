// components
import CurrencySelect from "@/components/input/CurrencySelect"
import FilterInput from "@/components/input/FilterInput"
import SummaryFilter from "./SummaryFilter"

// hooks
import { useManageSummary } from "./context"

const ManageSummary = () => {
  const { currency, dispatch } = useManageSummary()

  return (
    <div className="mx-1.5 flex flex-wrap justify-between items-end gap-x-8 gap-y-4 sm:mx-4">
      <div className="flex-auto w-3/5 h-full min-w-40 gap-y-1">
        <SummaryFilter />
      </div>

      <FilterInput className="flex-auto w-1/5 h-full min-w-36 max-w-56 ml-auto gap-y-1"
        labelProps={{ className: 'indent-border', htmlFor: 'currency' }}
        label={<><span className="text-accent overline">Calculate</span> by</>}
        onReset={() => dispatch({ type: 'SET_CURRENCY', payload: 'HUF' })} // TODO: set default currency based on... (?)
      >
        {() => (
          <CurrencySelect className="h-fit py-2.5 bg-background/50 rounded-full"
            id="currency"
            value={currency}
            onChange={(currency) => dispatch({ type: 'SET_CURRENCY', payload: currency })}
          />
        )}
      </FilterInput>
    </div>
  )
}

export default ManageSummary
