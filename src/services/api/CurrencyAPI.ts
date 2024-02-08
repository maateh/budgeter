import axios from "axios"

// types
import { Currencies } from "@/types"

// interfaces
import { ICurrencyAPI } from "@/services/api/interfaces"

class CurrencyAPI implements ICurrencyAPI {
  private static URL = 'https://openexchangerates.org/api/currencies.json'

  private static _instance: CurrencyAPI

  private constructor() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new CurrencyAPI()
    }
    return this._instance
  }

  async get(): Promise<Currencies> {
    const { data } = await axios({
      method: 'GET',
      url: CurrencyAPI.URL
    })

    return data as Currencies
  }
}

export default CurrencyAPI
