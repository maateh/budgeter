import { createContext } from "react"

// types
import { ManageSummaryContextType } from "./types"

const ManageSummaryContext = createContext<ManageSummaryContextType>({
  currency: '',
  dispatch: () => {}
})

export default ManageSummaryContext
