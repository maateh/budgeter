import axios from "axios"

// storage - cache
import CacheHelper from "@/services/storage/cache"

// interfaces
import { IExchangeAPI } from "@/services/api/interfaces"

// types
import { Currency } from "@/services/api/types"

class ExchangeAPI implements IExchangeAPI {
  private static _instance: ExchangeAPI

  /**
   * NOTE: It is NOT SAFE.
   * A backend service should be implemented in the future for 'Budgeter'
   * but now it's okay especially that it's a free accessible API key.
   */
  private static API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY

  private static BASE_URL = `https://v6.exchangerate-api.com/v6/${this.API_KEY}`

  private currencies: CacheHelper<Currency[]>

  private constructor() {
    this.currencies = new CacheHelper('currencies')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new ExchangeAPI()
    }
    return this._instance
  }

  public async getCurrencies(): Promise<Currency[]> {
    const expired = await this.currencies.isExpired()

    if (expired) {
      const url = ExchangeAPI.BASE_URL + '/codes'

      // TODO: implement type safe generic requestHandler
      const { data } = await axios.get(url)
      await this.currencies.saveToCache(data.supported_codes)

      return data.supported_codes
    }

    return await this.currencies.getCachedData()
  }
}

export default ExchangeAPI
