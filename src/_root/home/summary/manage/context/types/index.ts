export type ManageSummaryState = {
  currency?: string
  type?: 'budgets' | 'currencies'
  selected: string[]
}

export type ManageSummaryAction =
  { type: 'SET_CURRENCY', payload: ManageSummaryState['currency'] } |
  { type: 'SET_TYPE', payload: ManageSummaryState['type'] } |
  { type: 'SET_SELECTED', payload: ManageSummaryState['selected'] }

export type ManageSummaryContextType = ManageSummaryState & {
  dispatch: React.Dispatch<ManageSummaryAction>
}
