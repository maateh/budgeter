import { useNavigate } from "react-router-dom"

// icons
import { ArrowUpToLine, BadgePlus, Landmark, Wallet } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// components
import BudgetTypeBadge from "@/components/shared/BudgetTypeBadge"
import TransactionBadge from "@/components/shared/TransactionBadge"
import AddTransactionsPopover from "@/components/shared/AddTransactionsPopover"

// types
import Budget from "@/models/Budget"

type BudgetPreviewProps = {
  budget: Budget
}

const BudgetPreview = ({ budget }: BudgetPreviewProps) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/budgets/${budget.id}`)
  }

  return (
    <div className="rounded-[1.65rem] bg-primary-foreground/10 hover:drop-shadow-lg">
      <div
        onClick={handleNavigate}
        style={{
          backgroundColor: budget.theme.background,
          color: budget.theme.foreground
        }}
        className="px-4 py-3 flex items-center justify-between gap-x-4 rounded-t-3xl cursor-pointer shadow-2xl border-2 border-b-0 border-foreground/20">
        <div className="text-xl font-heading icon-wrapper justify-end">
          <Landmark strokeWidth={1.5} />
          <p className="font-medium">{budget.name}</p>
        </div>
        <BudgetTypeBadge budget={budget} size="icon-sm" />
      </div>

      <Separator className="py-[1px] bg-neutral-700 dark:bg-neutral-200" />

      <div className="px-4 py-3 rounded-b-3xl bg-card/75 shadow-2xl border-2 border-t-0 border-card">
        <div className="flex flex-wrap justify-between gap-2 small-caps">
          <Badge
            size="sm"
            variant={budget.balance.current > 0 ? 'income' : 'loss'}
            className="flex-1 w-full icon-wrapper justify-center"
          >
            <Wallet size={18} />
            <p className="flex justify-between items-center gap-x-2.5">
              Balance
              <span className="pl-2 font-heading border-primary/80 border-l-2">${budget.balance.current}</span>
            </p>
          </Badge>
          <Badge
            size="sm"
            variant="outline"
            className="flex-1 w-full icon-wrapper justify-center"
          >
            <ArrowUpToLine size={18} />
            <p className="flex justify-between items-center gap-x-2.5">
              Ceiling
              <span className="pl-2 font-heading border-border/70 border-l-2">${budget.balance.ceiling}</span>
            </p>
          </Badge>
        </div>

        <Progress
          value={budget.balance.current}
          maxValue={budget.balance.ceiling}
          variant={budget.balance.current > 0 ? budget.type : 'negative'}
          className="my-3"
        />

        <ul className="flex flex-wrap justify-start gap-x-2 gap-y-1">
          <li>
            <AddTransactionsPopover budgetId={budget.id}>
              <Badge variant="outline" className="cursor-pointer flex gap-x-1">
                <BadgePlus size={16} />
                <span>New</span>
              </Badge>
            </AddTransactionsPopover>
          </li>

          {Object.values(budget.transactions).slice(0, 6).map(tr => (
            <li key={tr.id}>
              <TransactionBadge transaction={tr} />
            </li>
          ))}
          
          <li>
            <Badge
              onClick={handleNavigate}
              variant="outline"
              className="cursor-pointer"
            >
              View all
            </Badge>
          </li>
        </ul>

        <div className="mt-4 flex justify-end flex-wrap gap-x-4 gap-y-2">
          <Badge variant="income">Income: ${budget.income}</Badge>
          <Badge variant="loss">Loss: -${budget.loss}</Badge>
        </div>
      </div>
    </div>
  )
}

export default BudgetPreview
