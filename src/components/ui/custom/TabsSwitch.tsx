import { useState } from "react"

// shadcn
import { TabsContent, TabsListProps } from "@/components/ui/tabs"

// components
import TabsSelector, { TabItem } from "@/components/input/TabsSelect"

type TabsSwitchProps<T extends string> = {
  tabItems: TabItem<T>[]
  children: (value: T) => React.ReactNode
  ref?: React.Ref<HTMLDivElement>
} & Omit<TabsListProps, 'children'>

function TabsSwitch <T extends string>({ tabItems, children, ref, ...props }: TabsSwitchProps<T>) {
  const [value, setValue] = useState(tabItems[0].value)

  return (
    <TabsSelector<T> {...props}
      tabItems={tabItems}
      defaultValue={value}
      setValue={setValue}
      ref={ref}
    >
      <TabsContent value={value}>
        {children(value)}
      </TabsContent>
    </TabsSelector>
  )
}

export default TabsSwitch
