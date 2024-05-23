import { useContext } from "react"

// context
import SummaryContext from "./SummaryContext"

const useSummaryContext = () => {
  const context = useContext(SummaryContext)

  if (!context) {
    throw new Error('SummaryContext must be used within its own Provider!')
  }

  return context
}

export default useSummaryContext
