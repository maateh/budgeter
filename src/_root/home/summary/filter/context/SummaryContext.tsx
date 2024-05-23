import { createContext } from "react"

// types
import { SummaryContextType } from "./types"

const SummaryContext = createContext<SummaryContextType>({
  currency: '',
  dispatch: () => {}
})

export default SummaryContext
