import { useContext } from "react"

// context
import APIContext from "@/services/providers/APIContext"

export const useAPI = () => {
  const context = useContext(APIContext)

  if (!context) {
    throw new Error('APIContext must be used within its own Provider!')
  }

  return context
}
