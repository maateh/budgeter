import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useExchangeRate = (baseCurrency: string, targetCurrency: string) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['exchangeRate', baseCurrency, targetCurrency],
    queryFn: async () => await api.exchange.getExchangeRate(baseCurrency, targetCurrency)
  })
}

export default useExchangeRate
