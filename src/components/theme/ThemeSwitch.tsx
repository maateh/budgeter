// icons
import { Moon, Sun } from "lucide-react"

// components
import StatusSwitch from "@/components/ui/custom/StatusSwitch"

// hooks
import { useTheme } from "@/services/providers/theme/ThemeContext.hooks"

const ThemeSwitch = () => {
  const { theme, switchTheme } = useTheme()

  return (
    <StatusSwitch
      status={theme}
      icon={{
        light: <Sun size={18} />,
        dark: <Moon size={18} />
      }}
      label={{
        light: 'Switch to Dark mode',
        dark: 'Switch to Light mode'
      }}
      handleSwitch={switchTheme}
    />
  )
}

export default ThemeSwitch
