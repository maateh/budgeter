// shadcn
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// icons
import { Landmark, Wallet } from "lucide-react"
import TransactionBadge from "./TransactionBadge"
import { Badge } from "../ui/badge"

const BudgetPreview = () => {
  return (
    <>
      <div className="flex flex-col gap-2 px-4 py-3 rounded-t-3xl bg-accent cursor-pointer">
        <div className="text-xl font-heading icon-wrapper justify-end">
          <p className="font-medium">Budget Name 1</p>
          <Landmark strokeWidth={1.5} />
        </div>
        <div className="icon-wrapper">
          <Wallet strokeWidth={1.5} />
          <span className="text-2xl font-heading font-bold p-0">$100</span>
        </div>
      </div>

      <Separator className="py-[1px] bg-neutral-700 dark:bg-neutral-200" />

      <div className="px-4 py-3 rounded-b-3xl bg-card/75">
        <div className="mt-1 flex justify-between font-semibold">
          <p>Total spent: $100</p>
          <p>Max. budget: $250</p>
        </div>

        <Progress variant="positive" value={40} className="mt-1 mb-2" />

        <ul className="my-1 flex justify-start gap-x-2">
          <li key={1}>
            <TransactionBadge amount={5} />
          </li>
          <li key={2}>
            <TransactionBadge amount={-25} />
          </li>
          <li key={3}>
            <TransactionBadge amount={100} />
          </li>
          <li key={4}>
            <TransactionBadge amount={69} />
          </li>
          <li key={5}>
            <TransactionBadge amount={-45} />
          </li>
          <li>
            <Badge variant="outline" className="cursor-pointer">View all</Badge>
          </li>
        </ul>

        <div className="mt-2 flex gap-x-4">
          <Badge variant="income">Income: $32</Badge>
          <Badge variant="loss">Loss: -$40</Badge>
        </div>
      </div>
    </>
  )
}

export default BudgetPreview
