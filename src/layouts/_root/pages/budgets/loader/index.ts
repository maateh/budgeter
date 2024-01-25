import { Params } from "react-router-dom"

// storage
import Storage from "@/storage"

type BudgetLoaderProps = {
  params: Readonly<Params<string>>
}

const BudgetLoader = async ({ params }: BudgetLoaderProps) => {
  if (!params.id) throw new Error('Budget ID not defined!')

  const budget = await Storage.budget.find(params.id)
  if (!budget) throw new Error('Budget ID not defined!')

  return { budget }
}

export default BudgetLoader
