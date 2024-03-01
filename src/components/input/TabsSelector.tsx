import { LucideIcon } from "lucide-react"

// shadcn
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TabItem<T extends string> = {
  Icon: LucideIcon
  value: T
}

type TabsSelectorProps<T extends string> = {
  tabItems: TabItem<T>[]
  setValue: React.Dispatch<React.SetStateAction<T>>
}

function TabsSelector <T extends string>({ tabItems, setValue }: TabsSelectorProps<T>) {
  return (
    <Tabs defaultValue={tabItems[0].value}>
      <TabsList>
        {tabItems.map(({ value, Icon }) => (
          <TabsTrigger className="icon-wrapper"
            key={value}
            value={value}
            onClick={() => setValue(value)}
          >
            <Icon />
            <p className="font-heading small-caps">{value}</p>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default TabsSelector
