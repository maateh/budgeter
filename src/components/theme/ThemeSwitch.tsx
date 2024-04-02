// icons
import { Moon, Sun } from "lucide-react"

// components
import StateToggle from "@/components/ui/custom/StateToggle"

// hooks
import { useTheme } from "@/services/providers/theme/ThemeContext.hooks"

const ThemeSwitch = () => {
  const { theme, switchTheme } = useTheme()

  return (
    <StateToggle
      status={theme === 'light' ? 'on' : 'off'}
      icon={{
        on: <Sun size={18} />,
        off: <Moon size={18} />
      }}
      tooltip={{
        on: 'Switch to Dark mode',
        off: 'Switch to Light mode'
      }}
      onClick={switchTheme}
      toggleOnHover
    />
  )
}

export default ThemeSwitch
