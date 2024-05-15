// types
import { Currency, ExchangeRate } from "@/services/api/types"

interface IExchangeAPI {
  getCurrencies(): Promise<Currency[]>
  getRates(currency: string): Promise<ExchangeRate>
}

export default IExchangeAPI
