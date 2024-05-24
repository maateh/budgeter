import { createContext } from "react"

// types
import { ManageSummaryContextType } from "./types"

const ManageSummaryContext = createContext<ManageSummaryContextType>({
  currency: '',
  selected: [],
  dispatch: () => {}
})

export default ManageSummaryContext
