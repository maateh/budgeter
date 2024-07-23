import { useState } from "react"

// icons
import { PackagePlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import BudgetList from "@/components/shared/budget/BudgetList"
import BudgetCurrencyFilter from "@/_root/home/budgets/BudgetCurrencyFilter"

// hooks
import { useDialog } from "@/hooks"

const Budgets = () => {
  const [currencyFilter, setCurrencyFilter] = useState<string | undefined>()

  const { openDialog } = useDialog()

  return (
    <>
      <div className="mb-5 flex flex-wrap justify-between items-center gap-x-4 gap-y-2.5">
        <h2 className="border-emerald-600 dark:border-emerald-400 indent-border">
          Your <span className="text-emerald-600 dark:text-emerald-400 overline">Budgets</span>
        </h2>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          size="lg"
          onClick={() => openDialog('/budgets/create')}
        >
          <PackagePlus className="size-5" />
          New Budget
        </Button>
      </div>

      <BudgetCurrencyFilter setCurrencyFilter={setCurrencyFilter} />
      <BudgetList
        params={{ limit: 8, offset: 0 }}
        filter={{ filterBy: { ['balance.currency']: currencyFilter }}}
      />
    </>
  )
}

export default Budgets
