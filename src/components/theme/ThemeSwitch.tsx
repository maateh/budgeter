// icons
import { Moon, Sun } from "lucide-react"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// hooks
import { useTheme } from "@/services/providers/theme/ThemeContext.hooks"

// types
import { Theme } from "@/services/providers/theme/ThemeContext"

const ThemeSwitch = () => {
  const { theme, switchTheme } = useTheme()

  return (
    <StateToggle<Theme, Theme>
      status={theme}
      icon={{
        light: <Sun size={18} />,
        dark: <Moon size={18} />
      }}
      tooltip={{
        light: 'Switch to Dark mode',
        dark: 'Switch to Light mode'
      }}
      onClick={switchTheme}
      toggleOnHover
    />
  )
}

export default ThemeSwitch
