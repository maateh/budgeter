// components
import BudgetSelect from "@/components/input/BudgetSelect"
import FilterInput from "@/components/input/FilterInput"
import FilterLayout from "./FilterLayout"

// hooks
import { useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"

const BasicFilter = () => {
  const {
    filterEntries,
    setFilterEntry, removeFilterEntries, toggleFilterType
  } = useFilter<TransactionSearchParams>()

  return (
    <FilterLayout
      title={<><span className="text-orange-600 dark:text-orange-400">Filter</span> Transactions</>}
    >
      <FilterInput
        label={<>Filter by <span className="text-accent overline">Budgets</span></>}
        labelProps={{ htmlFor: 'budgetId' }}
        onTypeChange={(filterKey) => toggleFilterType(filterKey, 'budgetId')}
        onReset={(filterKey) => removeFilterEntries(filterKey, ['budgetId'])}
      >
        {(filterKey) => (
          <BudgetSelect id="budgetId"
            value={filterEntries.budgetId as string}
            setValue={(id) => setFilterEntry(filterKey, { budgetId: id })}
            key={filterEntries.budgetId as string}
          />
        )}
      </FilterInput>

      <FilterInput
        label={<>Filter by <span className="text-accent overline">Types</span></>}
        labelProps={{ htmlFor: 'type' }}
        triggerProps={{ id: 'type' }}
        value={filterEntries.type as string}
        setValue={(type, filterKey) => setFilterEntry(filterKey, { type })}
        options={[
          { label: 'Default', value: 'default' as Transaction['type'] },
          { label: 'Borrow', value: 'borrow' as Transaction['type'] },
          { label: 'Transfer', value: 'transfer' as Transaction['type'] },
        ]}
        onTypeChange={(filterKey) => toggleFilterType(filterKey, 'type')}
        onReset={(filterKey) => removeFilterEntries(filterKey, ['type'])}
        key={filterEntries.type as string}
      />

      <FilterInput
        label={<>Filter by <span className="text-accent overline">Status</span></>}
        labelProps={{ htmlFor: 'status' }}
        triggerProps={{ id: 'status' }}
        value={filterEntries.processed as string}
        setValue={(processed, filterKey) => setFilterEntry(filterKey, { processed })}
        options={[
          { label: 'Processed', value: 'true' as TransactionSearchParams['processed'] },
          { label: 'Not processed', value: 'false' as TransactionSearchParams['processed'] },
        ]}
        onTypeChange={(filterKey) => toggleFilterType(filterKey, 'processed')}
        onReset={(filterKey) => removeFilterEntries(filterKey, ['processed'])}
        key={filterEntries.processed as string}
      />
    </FilterLayout>
  )
}

export default BasicFilter
