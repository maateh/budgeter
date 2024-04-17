// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BudgetSelect from "@/components/input/BudgetSelect"
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"

const BasicFilter = () => {
  const {
    filterParams,
    setFilterParam,
    removeFilterParam,
    toggleFilterType
  } = useFilter<Transaction>()

  return (
    <div className="h-fit px-6 py-5 space-y-3.5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-orange-600 dark:text-orange-400">Filter</span> Transactions
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      <FilterInput
        label={<>Filter by <span className="text-accent overline">Budgets</span></>}
        labelProps={{ htmlFor: 'budgetId' }}
        onTypeChange={(filterType) => toggleFilterType('budgetId', filterType)}
        onReset={(filterType) => removeFilterParam('budgetId', filterType)}
      >
        {(filterType) => (
          <BudgetSelect id="budgetId"
            value={filterParams.budgetId as string}
            setValue={(id) => setFilterParam({ budgetId: id }, filterType)}
            key={filterParams.budgetId as string}
          />
        )}
      </FilterInput>

      <FilterInput
        label={<>Filter by <span className="text-accent overline">Types</span></>}
        labelProps={{ htmlFor: 'type' }}
        triggerProps={{ id: 'type' }}
        value={filterParams.type as string}
        setValue={(type, filterType) => setFilterParam({ type }, filterType)}
        options={[
          { label: 'Default', value: 'default' as Transaction['type'] },
          { label: 'Borrow', value: 'borrow' as Transaction['type'] },
          { label: 'Transfer', value: 'transfer' as Transaction['type'] },
        ]}
        onTypeChange={(filterType) => toggleFilterType('type', filterType)}
        onReset={(filterType) => removeFilterParam('type', filterType)}
        key={filterParams.type as string}
      />

      {/* TODO: add status filter */}
    </div>
  )
}

export default BasicFilter
