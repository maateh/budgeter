// icons
import { LucideProps, Moon, Sun } from "lucide-react"

// components
import StateToggle, { StateToggleProps } from "@/components/ui/custom/StateToggle"

// hooks
import { useTheme } from "@/services/providers/theme/ThemeContext.hooks"

// utils
import { cn } from "@/lib/utils"

type ThemeSwitchProps = {
  iconProps?: LucideProps
} & Omit<StateToggleProps, 'status' | 'icon' | 'tooltip' | 'onClick'>

const ThemeSwitch = ({ iconProps, toggleOnHover = true, ...props }: ThemeSwitchProps) => {
  const { theme, switchTheme } = useTheme()

  return (
    <StateToggle
      status={theme === 'light' ? 'on' : 'off'}
      icon={{
        on: <Sun {...iconProps}
          className={cn("size-4 md:size-[1.125rem]", iconProps?.className)}
        />,
        off: <Moon {...iconProps}
          className={cn("size-4 md:size-[1.125rem]", iconProps?.className)}
        />
      }}
      tooltip={{
        on: 'Switch to Dark mode',
        off: 'Switch to Light mode'
      }}
      onClick={switchTheme}
      toggleOnHover={toggleOnHover}
      {...props}
    />
  )
}

export default ThemeSwitch
