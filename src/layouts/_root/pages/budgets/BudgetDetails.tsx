import { useNavigate } from "react-router-dom"

// icons
import { ArrowUpToLine, Pencil, Trash2, Wallet } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// components
import TransactionList from "@/components/shared/RecentTransactions"
import CreateBudgetSheet from "@/components/shared/BudgetSheet"
import ConfirmSheet from "@/components/shared/ConfirmSheet"
import BudgetTypeBadge from "@/components/shared/BudgetTypeBadge"

// hooks
import { useLoadBudgetQuery, useDeleteBudgetMutation } from "./BudgetDetails.hooks"
import InfoBadge from "@/components/shared/InfoBadge"

const BudgetDetails = () => {
  const navigate = useNavigate()
  const { data: budget, isLoading } = useLoadBudgetQuery()
  const { mutateAsync: deleteBudget } = useDeleteBudgetMutation()

  const deleteConfirm = async () => {
    try {
      await deleteBudget(budget!) 
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return !isLoading && budget ? (
    <div className="page-wrapper">
      <h1 className="ml-6">Budget <span className="text-green-400">Details</span></h1>
      
      <div className="w-full flex flex-col justify-between gap-4 md:flex-row">
        <section className="w-full h-fit layout-rounded bg-primary md:w-4/6 md:max-w-5xl">
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

              <CreateBudgetSheet type="edit" budget={budget}>
                <Button
                  variant="default"
                  border="md"
                  size="lg"
                  className="flex items-center gap-x-2"
                >
                  <Pencil size={18} />
                  <span>Edit</span>
                </Button>
              </CreateBudgetSheet>
            </div>
          </div>

          <Separator className="mt-4 mb-8 bg-primary-foreground/15" />

          <div className="flex flex-col gap-y-2">
            <div className="flex flex-wrap justify-between gap-8">
              <div className="flex flex-col gap-x-4 gap-y-3 text-lg small-caps">
                <InfoBadge
                  label="Current Balance"
                  value={`$${budget.balance.current}`}
                  size="lg"
                  variant={budget.balance.current > 0 ? 'income' : 'loss'}
                  icon={<Wallet strokeWidth={2.25} />}
                />
                <InfoBadge
                  label="Ceiling"
                  value={`$${budget.balance.ceiling}`}
                  size="lg"
                  icon={<ArrowUpToLine strokeWidth={2.25} />}
                />
              </div>

              <div className="ml-auto flex flex-wrap justify-end items-end gap-x-4 gap-y-2 truncate">
                <InfoBadge
                  label="Total Income"
                  value={`$${budget.income}`}
                  size="md"
                  variant="income"
                />
                <InfoBadge
                  label="Total Loss"
                  value={`$${budget.loss}`}
                  size="md"
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
        </section>

        <section className="w-full min-w-80 layout-rounded bg-primary md:w-2/6 md:max-w-lg">
          <TransactionList
            transactions={Object.values(budget.transactions)}
            startingQuantity={6}
            loadingQuantity={4}
            budget={budget}
          />
        </section>
      </div>
    </div>
  ) : (
    <>Loading</> // TODO: skeleton
  )
}

export default BudgetDetails
