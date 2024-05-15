// types
import { Currency } from "@/services/api/types"

interface IExchangeAPI {
  getCurrencies(): Promise<Currency[]>
}

export default IExchangeAPI
