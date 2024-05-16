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

type ExchangeRateParams = {
  baseCurrency: string
  targetCurrency: string
}

type ExchangeRateResponse = {
  base_code: string
  target_code: string
  conversion_rate: number
  time_next_update_unix: number
}

const getExchangeRate = requestHandler<ExchangeRateResponse, ExchangeRateParams>((params) => {
  const { baseCurrency, targetCurrency } = params || {}

  const route = `/pair/${baseCurrency}/${targetCurrency}`
  return axios.get(ExchangeAPI.BASE_URL + route)
})

type ExchangeRatesParams = { code: string }

type ExchangeRatesResponse = {
  base_code: string
  conversion_rates: ExchangeRate
  time_next_update_unix: number
}

const getExchangeRates = requestHandler<ExchangeRatesResponse, ExchangeRatesParams>((params) => {
  const { code } = params || {}
  
  const route = `/latest/${code}`
  return axios.get(ExchangeAPI.BASE_URL + route)
})

export { getCurrencies, getExchangeRate, getExchangeRates }
