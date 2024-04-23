// shadcn
import { Separator } from "@/components/ui/separator"

// components
import BudgetSelect from "@/components/input/BudgetSelect"
import FilterInput from "@/components/input/FilterInput"

// hooks
import { useFilter } from "@/hooks"

// types
import { Transaction } from "@/services/api/types"
import { TransactionSearchParams } from "@/_root/transactions/filter/types"

const BasicFilter = () => {
  const {
    filterEntries,
    setFilterEntry, removeFilterEntry, toggleFilterType
  } = useFilter<TransactionSearchParams>()

  return (
    <div className="h-fit px-6 py-5 space-y-3.5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        <span className="text-orange-600 dark:text-orange-400">Filter</span> Transactions
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      <FilterInput
        label={<>Filter by <span className="text-accent overline">Budgets</span></>}
        labelProps={{ htmlFor: 'budgetId' }}
        onTypeChange={(filterKey) => toggleFilterType(filterKey, 'budgetId')}
        onReset={(filterKey) => removeFilterEntry(filterKey, 'budgetId')}
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
        onReset={(filterKey) => removeFilterEntry(filterKey, 'type')}
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
        onReset={(filterKey) => removeFilterEntry(filterKey, 'processed')}
        key={filterEntries.processed as string}
      />
    </div>
  )
}

export default BasicFilter
