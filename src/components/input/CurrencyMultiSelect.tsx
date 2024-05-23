// shadcn
import { MultiSelect, MultiSelectProps, OptionType } from "@/components/ui/multi-select"

// hooks
import { useCurrencies } from "@/lib/react-query/queries"

type CurrencyMultiSelectProps = {
  selected: string[]
  onSelect: (ids: React.SetStateAction<string[]>) => void
} & Omit<MultiSelectProps, 'options'>

const CurrencyMultiSelect = ({ selected, onSelect, ...props }: CurrencyMultiSelectProps) => {
  const { data: currencies, isLoading } = useCurrencies()

  return (
    <MultiSelect
      selected={selected}
      onSelect={onSelect}
      disabled={isLoading || !currencies}
      options={currencies ? currencies.reduce((options, [code, name]) => ([
        ...options, {
          label: name,
          value: code
        }
      ]), [] as OptionType[]) : []}
      {...props}
    />
  )
}

export default CurrencyMultiSelect
