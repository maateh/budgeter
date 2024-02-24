import { useState } from "react"
import { LucideIcon } from "lucide-react"

// shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TabItem<T extends string> = {
  Icon?: LucideIcon
  value: T
  content: React.JSX.Element
}

type TabsSwitcherProps<T extends string> = {
  label?: string
  defaultValue: T
  tabItems: TabItem<T>[]
}

const TabsSwitcher = <T extends string,>({ label, defaultValue, tabItems }: TabsSwitcherProps<T>) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <Tabs value={value}>
      {label && (
        <p className="mb-1.5 text-center text-lg font-heading font-medium">
          {label}
        </p>
      )}

      <TabsList>
        {tabItems.map(({ value, Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            onClick={() => setValue(value)}
            className="icon-wrapper"
          >
            {Icon && <Icon />}
            <p className="font-heading small-caps">{value}</p>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabItems.map(item => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default TabsSwitcher
