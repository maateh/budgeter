import axios from "axios"

// api
import { ExchangeAPI } from "@/services/api/endpoints"

// types
import { Currency } from "@/services/api/types"

// utils
import { requestHandler } from "@/services/api/utils"

type CurrenciesResponse = {
  supported_codes: Currency[]
}

const getCurrencies = requestHandler<CurrenciesResponse>(() => {
  const route = '/codes'
  return axios.get(ExchangeAPI.BASE_URL + route)
})

export { getCurrencies }
