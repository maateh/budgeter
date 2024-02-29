import { useEffect, useState } from "react"

// context
import ThemeContext, { Theme } from "@/services/providers/theme/ThemeContext"

type ThemeProviderProps = React.PropsWithChildren & {
  defaultTheme?: Theme
  storageKey?: string
}

const ThemeProvider = ({
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  children,
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const switchTheme = () => {
    setTheme(prevTheme => {
      const theme = prevTheme === 'light' ? 'dark' : 'light'
      
      localStorage.setItem(storageKey, theme)
      return theme
    })
  }

  return (
    <ThemeContext.Provider {...props} value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
