import { createContext } from "react"

// types
import API from "@/services/api"

type APIContextType = {
  api: API
  switchToStorage: () => void
  switchToRemote: () => void
}

const APIContext = createContext<APIContextType>({
  api: API.getInstance('storage'),
  switchToStorage: () => {},
  switchToRemote: () => {}
})

export default APIContext
