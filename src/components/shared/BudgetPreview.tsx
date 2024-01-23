// shadcn
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// components
import TransactionForm from "@/components/form/TransactionForm"
import TransactionBadge from "@/components/shared/TransactionBadge"

// icons
import { BadgePlus, Landmark, Wallet } from "lucide-react"

// models
import Budget from "@/models/Budget"

type BudgetPreviewProps = {
  budget: Budget
}

const BudgetPreview = ({ budget }: BudgetPreviewProps) => {
  return (
    <div className="hover:drop-shadow-lg rounded-[1.65rem] bg-primary-foreground/10">
      <div
        style={{
          backgroundColor: budget.theme.background,
          color: budget.theme.foreground
        }}
        className="flex flex-col gap-2 px-4 py-3 rounded-t-3xl cursor-pointer shadow-2xl border-2 border-b-0 border-foreground/20">
        <div className="text-xl font-heading icon-wrapper justify-end">
          <p className="font-medium">{budget.name}</p>
          <Landmark strokeWidth={1.5} />
        </div>
        <div className="icon-wrapper">
          <Wallet strokeWidth={1.5} />
          <span className="text-2xl font-heading font-bold p-0">${budget.balance.current}</span>
        </div>
      </div>

      <Separator className="py-[1px] bg-neutral-700 dark:bg-neutral-200" />

      <div className="px-4 py-3 rounded-b-3xl bg-card/75 shadow-2xl border-2 border-t-0 border-card">
        <p className="mt-1 flex flex-end font-semibold">
          Budget ceiling: ${budget.balance.ceiling}
        </p>

        <Progress
          value={budget.balance.current}
          maxValue={budget.balance.ceiling}
          variant={budget.type}
          className="mt-1 mb-2"
        />

        <ul className="my-1 flex flex-wrap justify-start gap-x-2 gap-y-1">
          <li>
            <Popover>
              <PopoverTrigger>
                <Badge variant="outline" className="cursor-pointer flex gap-x-1">
                  <BadgePlus size={16} />
                  <span>New</span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent>
                <p className="pb-1 mb-2 text-lg font-medium font-heading border-b border-border/25">
                  Add Transactions
                </p>
                <TransactionForm budgetId={budget.id} />
              </PopoverContent>
            </Popover>
          </li>

          {Object.values(budget.transactions).slice(0, 6).map(tr => (
            <li key={tr.id}>
              <TransactionBadge transaction={tr} />
            </li>
          ))}
          
          <li>
            <Badge variant="outline" className="cursor-pointer">
              View all
            </Badge>
          </li>
        </ul>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          <Badge variant="income">Income: ${budget.income}</Badge>
          <Badge variant="loss">Loss: -${budget.loss}</Badge>
        </div>
      </div>
    </div>
  )
}

export default BudgetPreview
