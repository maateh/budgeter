import { useContext } from "react"

// context
import ManageSummaryContext from "./ManageSummaryContext"

const useManageSummary = () => {
  const context = useContext(ManageSummaryContext)

  if (!context) {
    throw new Error('ManageSummaryContext must be used within its own Provider!')
  }

  return context
}

export default useManageSummary
