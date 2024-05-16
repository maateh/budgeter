import { useQuery } from "@tanstack/react-query"

// api
import { useAPI } from "@/services/providers/api/APIContext.hooks"

const useExchangeRates = (currency: string) => {
  const { api } = useAPI()

  return useQuery({
    queryKey: ['exchangeRates', currency],
    queryFn: async () => await api.exchange.getExchangeRates(currency)
  })
}

export default useExchangeRates
