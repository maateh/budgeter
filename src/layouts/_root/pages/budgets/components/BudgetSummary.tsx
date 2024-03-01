// icons
import { ArrowUpToLine, Pencil, Wallet } from 'lucide-react'

// shadcn
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// components
import BudgetTypeBadge from '@/components/shared/budget/BudgetTypeBadge'
import InfoBadge from '@/components/ui/custom/InfoBadge'
import FormDialog from '@/components/form/FormDialog'
import BudgetForm from '@/components/form/budget/BudgetForm'
import BudgetDeletion from '@/components/shared/budget/BudgetDeletion'

// types
import { Budget } from '@/services/api/types'

// utils
import { formatWithCurrency } from '@/utils'

type BudgetSummaryProps = {
  budget: Budget
}

const BudgetSummary = ({ budget }: BudgetSummaryProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2
          className="px-12 py-4 overline rounded-full"
          style={{
            backgroundColor: budget.theme.background,
            color: budget.theme.foreground
          }}
        >
          {budget.name}
        </h2>

        <div className="flex justify-center items-center gap-x-4 gap-y">
          <BudgetDeletion budget={budget} />

          <FormDialog
            title={<>Edit <span className="text-green-400 overline">Budget</span></>}
            formLayout={<BudgetForm type="edit" budget={budget} />}
          >
            <Button
              variant="default"
              border="md"
              size="lg"
              className="flex items-center gap-x-2"
            >
              <Pencil size={18} />
              <span>Edit</span>
            </Button>
          </FormDialog>
        </div>
      </div>

      <Separator className="mt-4 mb-6 bg-primary-foreground/15" />

      <div className="flex flex-col gap-y-2">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="flex flex-col gap-x-4 gap-y-3 text-lg small-caps">
            <InfoBadge
              label="Current Balance"
              value={formatWithCurrency(budget.balance.current, budget.balance.currency)}
              size="lg"
              variant={budget.balance.current > 0 ? 'income' : 'loss'}
              icon={<Wallet strokeWidth={2.25} />}
            />
            <InfoBadge
              label="Ceiling"
              value={formatWithCurrency(budget.balance.ceiling, budget.balance.currency)}
              size="md"
              icon={<ArrowUpToLine strokeWidth={2.25} />}
            />
          </div>

          <div className="ml-auto flex flex-wrap justify-end items-end gap-x-4 gap-y-2 truncate">
            {/* <InfoBadge
              label="Total Income"
              value={formatWithCurrency(budget.income, budget.currency)}
              size="sm"
              variant="income"
            />
            <InfoBadge
              label="Total Loss"
              value={formatWithCurrency(budget.loss, budget.currency)}
              size="sm"
              variant="loss"
            /> */}
          </div>
        </div>


        <div className="flex items-center justify-between gap-x-4">
          <BudgetTypeBadge budget={budget} size="icon-md" />
          <Progress
            value={budget.balance.current}
            maxValue={budget.balance.ceiling}
            variant={budget.balance.current > 0 ? budget.type : 'negative'}
            className="my-3.5 h-6"
          />
        </div>
      </div>
    </>
  )
}

export default BudgetSummary