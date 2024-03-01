import { useNavigate } from "react-router-dom"

// icons
import { ArrowUpToLine, BadgePlus, Landmark, Wallet } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// components
import BudgetTypeBadge from "@/components/shared/budget/BudgetTypeBadge"
import InfoBadge from "@/components/ui/custom/InfoBadge"
import FormDialog from "@/components/form/FormDialog"
import TransactionForm from "@/components/form/transaction/TransactionForm"

// types
import { Budget } from "@/services/api/types"

// utils
import { formatWithCurrency } from "@/utils"

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
          <InfoBadge
            label="Balance"
            value={formatWithCurrency(budget.balance.current, budget.balance.currency)}
            size="sm"
            variant={budget.balance.current > 0 ? 'income' : 'loss'}
            icon={<Wallet size={18} />}
          />
          <InfoBadge
            label="Ceiling"
            value={formatWithCurrency(budget.balance.ceiling, budget.balance.currency)}
            size="sm"
            icon={<ArrowUpToLine size={18} />}
          />
        </div>

        <Progress
          value={budget.balance.current}
          maxValue={budget.balance.ceiling}
          variant={budget.balance.current > 0 ? budget.type : 'negative'}
          className="my-3"
        />

        <ul className="flex flex-wrap justify-start gap-x-2 gap-y-1">
          <li>
            <FormDialog
              title={<>Add <span className="text-yellow-400 overline">Transaction</span></>}
              formLayout={<TransactionForm budgetId={budget.id} />}
            >
              <Badge
                size="xs"
                variant="outline"
                className="cursor-pointer gap-x-1"
              >
                <BadgePlus size={16} />
                <span>New</span>
              </Badge>
            </FormDialog>
          </li>

          {/* TODO: get budget transactions */}
          {/* {Object.values(budget.transactions)
            .filter(tr => tr.status === 'processed')
            .slice(0, 6)
            .map(tr => (
              <li key={tr.id}>
                <TransactionBadge
                  transaction={tr}
                  currency={budget.currency}
                  size="xs"
                  iconSize={10}
                />
              </li>
            ))
          } */}
          
          <li>
            <Badge
              onClick={handleNavigate}
              variant="outline"
              size="xs"
              className="cursor-pointer"
            >
              View all
            </Badge>
          </li>
        </ul>

        <div className="w-fit ml-auto mt-4 grid grid-cols-2 gap-x-2.5">
          {/* TODO: add income & expense fields to budget */}
          {/* <InfoBadge
            label="Income"
            value={formatWithCurrency(budget.income, budget.currency)}
            size="xs"
            variant="income"
          />
          <InfoBadge
            label="Loss"
            value={formatWithCurrency(budget.loss, budget.currency)}
            size="xs"
            variant="loss"
          /> */}
        </div>
      </div>
    </div>
  )
}

export default BudgetPreview
