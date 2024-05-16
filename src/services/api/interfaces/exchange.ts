// types
import { Currency, ExchangeRate } from "@/services/api/types"

interface IExchangeAPI {
  getCurrencies(): Promise<Currency[]>
  getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<number>
  getExchangeRates(currency: string): Promise<ExchangeRate>
}

export default IExchangeAPI
