import { LucideIcon } from "lucide-react"

// shadcn
import { Tabs, TabsList, TabsListProps, TabsTrigger } from "@/components/ui/tabs"

export type TabItem<T extends string> = {
  Icon: LucideIcon
  value: T
}

type TabsSelectProps<T extends string> = {
  tabItems: TabItem<T>[]
  defaultValue?: T
  setValue: React.Dispatch<React.SetStateAction<T>>
  ref?: React.Ref<HTMLDivElement>
} & TabsListProps

function TabsSelect<T extends string>({ tabItems, defaultValue, setValue, children, ref, ...props }: TabsSelectProps<T>) {
  return (
    <Tabs defaultValue={defaultValue || tabItems[0].value}>
      <TabsList {...props} ref={ref}>
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

      {children}
    </Tabs>
  )
}

export default TabsSelect
