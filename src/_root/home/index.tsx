import { useNavigate } from "react-router-dom"

// icons
import { Archive } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import Transactions from "@/components/shared/transaction/Transactions"
import Budgets from "./budgets"
import Summary from "./summary"

// hooks
import useTitle from "@/hooks/title"

// context
import { ManageSummaryProvider } from "./summary/manage/context"

const Home = () => {
  const navigate = useNavigate()

  useTitle('Home')

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
          <Archive className="size-5" strokeWidth={2.25} />
          Manage Backups
        </Button>
      </div>

      <div className="w-full flex flex-col justify-between gap-x-8 gap-y-10 md:flex-row">
        <div className="flex-1 w-full min-w-60 flex flex-col gap-y-4 md:min-w-80 md:max-w-4xl">
          <section className="w-full section-wrapper">
            <ManageSummaryProvider>
              <Summary />
            </ManageSummaryProvider>
          </section>

          <Separator />
          
          <section className="w-full section-wrapper">
            <Budgets />
          </section>
        </div>

        <section className="flex-1 w-full min-w-60 md:w-1/3 md:max-w-lg">
          <Transactions />
        </section>
      </div>
    </div>
  )
}

export default Home
