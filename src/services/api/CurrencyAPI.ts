// types
import { Currencies } from "@/types"

// interfaces
import { ICurrencyAPI } from "@/services/api/interfaces"

class CurrencyAPI implements ICurrencyAPI {
  private static _instance: CurrencyAPI

  private constructor() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new CurrencyAPI()
    }
    return this._instance
  }

  get(): Currencies {
    return {
      curr_1: 'Currency 1',
      curr_2: 'Currency 2',
      curr_3: 'Currency 3',
      curr_4: 'Currency 4',
      curr_5: 'Currency 5'
    }
  }
}

export default CurrencyAPI
