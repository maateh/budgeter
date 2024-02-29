import { createContext } from "react"

export type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  switchTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  switchTheme: () => {},
})

export default ThemeContext
