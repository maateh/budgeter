import axios from "axios"

// api
import { ExchangeAPI } from "@/services/api/endpoints"

// types
import { Currency, ExchangeRate } from "@/services/api/types"

// utils
import { requestHandler } from "@/services/api/utils"

type CurrenciesResponse = {
  supported_codes: Currency[]
}

const getCurrencies = requestHandler<CurrenciesResponse>(() => {
  const route = '/codes'
  return axios.get(ExchangeAPI.BASE_URL + route)
})

type RateParams = { code: string }

type ExchangeRateResponse = {
  base_code: string
  conversion_rates: ExchangeRate
  time_next_update_unix: number
}

const getRates = requestHandler<ExchangeRateResponse, RateParams>((params) => {
  const { code } = params || {}
  
  const route = `/latest/${code}`
  return axios.get(ExchangeAPI.BASE_URL + route)
})

export { getCurrencies, getRates }
