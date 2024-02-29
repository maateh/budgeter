import { useContext } from "react"

// context
import ThemeContext from "@/services/providers/theme/ThemeContext"

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('ThemeContext must be used within its own Provider!')
  }

  return context
}
