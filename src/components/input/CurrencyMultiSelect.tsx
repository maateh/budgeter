// shadcn
import { MultiSelect, OptionType } from "@/components/ui/multi-select"

// hooks
import { useCurrencies } from "@/lib/react-query/queries"

type CurrencyMultiSelectProps = {
  selected: string[]
  onChange: (ids: React.SetStateAction<string[]>) => void
} & Omit<MultiSelectProps, 'options'>

const CurrencyMultiSelect = ({ selected, onChange }: CurrencyMultiSelectProps) => {
  const { data: currencies, isLoading } = useCurrencies()

  return (
    <MultiSelect
      selected={selected}
      setSelected={onChange}
      disabled={isLoading || !currencies}
      options={currencies ? currencies.reduce((options, [code, name]) => ([
        ...options, {
          label: name,
          value: code
        }
      ]), [] as OptionType[]) : []}
    />
  )
}

export default CurrencyMultiSelect
