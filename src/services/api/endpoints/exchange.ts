// storage - cache
import CacheHelper from "@/services/storage/cache"

// interfaces
import { IExchangeAPI } from "@/services/api/interfaces"

// types
import { Currency, ExchangeRate } from "@/services/api/types"

// utils
import { getCurrencies, getRates } from "@/services/api/requests/exchange"

class ExchangeAPI implements IExchangeAPI {
  private static _instance: ExchangeAPI

  /**
   * NOTE: It is NOT SAFE.
   * A backend service should be implemented in the future for 'Budgeter'
   * but now it's okay especially that it's a free accessible API key.
   */
  private static API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY
  public static BASE_URL = `https://v6.exchangerate-api.com/v6/${this.API_KEY}`

  private currencies: CacheHelper<Currency[]>
  private rates: CacheHelper<ExchangeRate>

  private constructor() {
    this.currencies = new CacheHelper('currencies')
    this.rates = new CacheHelper('rates')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new ExchangeAPI()
    }
    return this._instance
  }

  public async getCurrencies(): Promise<Currency[]> {
    const cacheKey = 'currencies'
    const expired = await this.currencies.isExpired(cacheKey)

    if (!expired) {
      return await this.currencies.getCachedData(cacheKey)
    }

    const response = await getCurrencies()
    if (response.code === 'error') {
      throw new Error(response.error.message)
    }
    
    /**
     * Currencies are not expected to change frequently
     * so it could be stored in cache for a long time.
     * 
     * Cache time: 30 days
     */
    const cacheTime = 30 * 24 * 60 * 60 * 1000
    const { data: currencies } = await this.currencies.saveToCache(
      cacheKey, response.data.supported_codes, { cacheTime }
    )

    return currencies
  }

  public async getRates(currency: string): Promise<ExchangeRate> {
    const expired = await this.rates.isExpired(currency)

    if (!expired) {
      return await this.rates.getCachedData(currency)
    }

    const response = await getRates({ code: currency })

    if (response.code === 'error') {
      throw new Error(response.error.message)
    }

    const {
      conversion_rates,
      time_next_update_unix
    } = response.data

    const { data: rates } = await this.rates.saveToCache(
      currency, conversion_rates, { expire: time_next_update_unix * 1000 }
    )

    return rates
  }
}

export default ExchangeAPI
