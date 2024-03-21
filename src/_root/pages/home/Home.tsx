import { useNavigate } from "react-router-dom"

// icons
import { Archive } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import Transactions from "@/components/shared/transaction/Transactions"
import BudgetSummary from "./components/BudgetSummary"
import Budgets from "./components/Budgets"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper">
      <div className="flex flex-wrap-reverse items-center justify-between gap-x-12">
        <h1>
          Budgeter <span className="text-accent">Dashboard</span>
        </h1>

        <Button className="ml-auto icon-wrapper"
          variant="outline"
          onClick={() => navigate('/backup')}
        >
          <Archive />
          Manage Backups
        </Button>
      </div>

      <div className="w-full flex flex-col justify-between gap-x-8 gap-y-10 md:flex-row">
        <div className="flex-1 w-full min-w-64 flex flex-col gap-y-4 md:min-w-80 md:max-w-4xl">
          <section className="w-full section-wrapper">
            <BudgetSummary />
          </section>

          <Separator />
          
          <section className="w-full section-wrapper">
            <Budgets />
          </section>
        </div>

        <section className="flex-1 w-full min-w-64 md:w-1/3 md:max-w-lg">
          <Transactions />
        </section>
      </div>
    </div>
  )
}

export default Home
