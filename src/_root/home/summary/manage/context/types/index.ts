export type ManageSummaryState = {
  currency: string
  type?: 'budgets' | 'currencies'
}

export type ManageSummaryAction =
  { type: 'SET_CURRENCY', payload: ManageSummaryState['currency'] } |
  { type: 'SET_TYPE', payload: ManageSummaryState['type'] }

export type ManageSummaryContextType = ManageSummaryState & {
  dispatch: React.Dispatch<ManageSummaryAction>
}
