import { useReducer } from "react"

// context
import ManageSummaryContext from "./ManageSummaryContext"

// types
import { ManageSummaryAction, ManageSummaryState } from "./types"

const reducer = (state: ManageSummaryState, action: ManageSummaryAction): ManageSummaryState => {
  switch (action.type) {
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload }
    case 'SET_TYPE':
      return { ...state, type: action.payload !== state.type ? action.payload : undefined }
    case 'SET_SELECTED':
      return { ...state, selected: action.payload }
    default:
      return state
  }
}

type ManageSummaryProviderProps = {
  currency: string
} & React.PropsWithChildren

const ManageSummaryProvider = ({ currency, children }: ManageSummaryProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    currency,
    selected: []
  })

  return (
    <ManageSummaryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ManageSummaryContext.Provider>
  )
}

export default ManageSummaryProvider
