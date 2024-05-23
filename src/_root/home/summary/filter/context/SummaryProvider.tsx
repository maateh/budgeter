import { useReducer } from "react"

// context
import SummaryContext from "./SummaryContext"

// types
import { SummaryAction, SummaryState } from "./types"

const reducer = (state: SummaryState, action: SummaryAction): SummaryState => {
  switch (action.type) {
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload }
    case 'SET_TYPE':
      return { ...state, type: action.payload !== state.type ? action.payload : undefined }
    default:
      return state
  }
}

type SummaryProviderProps = {
  currency: string
} & React.PropsWithChildren

const SummaryProvider = ({ currency, children }: SummaryProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { currency })

  return (
    <SummaryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SummaryContext.Provider>
  )
}

export default SummaryProvider
