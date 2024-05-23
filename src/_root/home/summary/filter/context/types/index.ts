export type SummaryState = {
  currency: string
  type?: 'budgets' | 'currencies'
}

export type SummaryAction =
  { type: 'SET_CURRENCY', payload: SummaryState['currency'] } |
  { type: 'SET_TYPE', payload: SummaryState['type'] }

export type SummaryContextType = SummaryState & {
  dispatch: React.Dispatch<SummaryAction>
}
