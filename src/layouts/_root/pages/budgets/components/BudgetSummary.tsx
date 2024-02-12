import { useNavigate } from 'react-router-dom'

// icons
import { ArrowUpToLine, Pencil, Trash2, Wallet } from 'lucide-react'

// shadcn
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// components
import BudgetTypeBadge from '@/components/ui/custom/BudgetTypeBadge'
import InfoBadge from '@/components/ui/custom/InfoBadge'
import ConfirmSheet from '@/components/shared/ConfirmSheet'
import FormDialog from '@/components/shared/FormDialog'
import BudgetForm from '@/components/form/budget/BudgetForm'

// hooks
import { useDeleteBudgetMutation } from './BudgetSummary.hooks'

// types
import Budget from '@/models/Budget'

// utils
import { formatWithCurrency } from '@/utils'

type BudgetSummaryProps = {
  budget: Budget
}

const BudgetSummary = ({ budget }: BudgetSummaryProps) => {
  const navigate = useNavigate()
  const { mutateAsync: deleteBudget } = useDeleteBudgetMutation()

  const deleteConfirm = async () => {
    try {
      await deleteBudget(budget!) 
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

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
          <ConfirmSheet
            title={`Delete "${budget.name}" Budget`}
            message="Are you sure you want to delete this budget?"
            variant="confirm-negative"
            confirm={deleteConfirm}
          >
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-x-1.5 "
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </Button>
          </ConfirmSheet>

          <FormDialog
            title={<>Create <span className="text-green-400 overline">Budget</span></>}
            form={<BudgetForm type="edit" budget={budget} />}
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
              value={formatWithCurrency(budget.balance.current, budget.currency)}
              size="lg"
              variant={budget.balance.current > 0 ? 'income' : 'loss'}
              icon={<Wallet strokeWidth={2.25} />}
            />
            <InfoBadge
              label="Ceiling"
              value={formatWithCurrency(budget.balance.ceiling, budget.currency)}
              size="md"
              icon={<ArrowUpToLine strokeWidth={2.25} />}
            />
          </div>

          <div className="ml-auto flex flex-wrap justify-end items-end gap-x-4 gap-y-2 truncate">
            <InfoBadge
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
            />
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